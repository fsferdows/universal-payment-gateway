import { toPaise } from '@youpi/common';

/**
 * Intelligent Monetary Amount Extractor for Indian UPI & Bank SMS.
 * Extracts amounts with prefix (Rs. 200, INR 500), suffix (20.00 Rs),
 * proximity words ("20.00 received", "credited with 20.00"),
 * or standalone decimal amounts ("20.00").
 * @param {string} text
 * @returns {{ amountStr: string, amountPaise: bigint } | null}
 */
export function extractIntelligentAmount(text) {
  if (!text || typeof text !== 'string') return null;

  const normalizedText = text.replace(/\s+/g, ' ');

  // 0. Remove balance mentions (e.g. "Avl Bal Rs 10,000", "Balance Tk 15,450.00")
  const balancePattern = /(?:(?:avl|avail|available|tot|total|ledger|clear|curr|current|new)(?:\s+(?:bal|balance|limit))?|bal|balance)\b[\s:=-]*(?:(?:rs\.?|inr|tk\.?|taka|bdt|usd|\$|[₹৳])\s*)?\b\d[\d,]{0,15}(?:\.\d{1,2})?/gi;
  const sanitizedText = normalizedText.replace(balancePattern, ' ').trim();

  // Pattern 0: Direct credit proximity phrases (e.g. "credited with Rs. 500", "received ₹200.00", "Cash In Tk 3,000")
  const directCreditMatch = sanitizedText.match(/(?:credited\s*(?:with|by|for)?|received|deposit(?:ed)?|cash\s*in)\s*[:=-]?\s*(?:(?:rs\b\.?|inr\b|tk\b\.?|taka\b|bdt\b|usd\b|\$)|[₹৳])?[\s:=-]*([\d,]+(?:\.\d{1,2})?)/i) ||
    sanitizedText.match(/(?:(?:rs\b\.?|inr\b|tk\b\.?|taka\b|bdt\b|usd\b|\$)|[₹৳])[\s:=-]*([\d,]+(?:\.\d{1,2})?)\s*(?:(?:has\s+been|is)\s+)?(?:credited|received|deposited)/i);
  if (directCreditMatch && (directCreditMatch[1] || directCreditMatch[2])) {
    const clean = (directCreditMatch[1] || directCreditMatch[2]).replace(/,/g, '');
    try {
      return { amountStr: clean, amountPaise: toPaise(clean) };
    } catch {}
  }

  // Pattern 1: Standard currency prefix (e.g. Rs. 20.00, Rs 200, INR 500.00, Tk 3000, ৳500, USD 25.00)
  const prefixMatch = sanitizedText.match(/(?:(?:rs\b\.?|inr\b|tk\b\.?|taka\b|bdt\b|usd\b|\$)|[₹৳])[\s:=-]*([\d,]+(?:\.\d{1,2})?)/i);
  if (prefixMatch && prefixMatch[1]) {
    const clean = prefixMatch[1].replace(/,/g, '');
    try {
      return { amountStr: clean, amountPaise: toPaise(clean) };
    } catch {}
  }

  // Pattern 2: Standard currency suffix (e.g. 20.00 Rs, 20.00 INR, 3000 Tk, 25 USD)
  const suffixMatch = sanitizedText.match(/(?:^|[^\w.])([\d,]+(?:\.\d{1,2})?)[\s:=-]*(?:(?:rs\b\.?|inr\b|tk\b\.?|taka\b|bdt\b|usd\b|\$)|[₹৳])/i);
  if (suffixMatch && suffixMatch[1]) {
    const clean = suffixMatch[1].replace(/,/g, '');
    try {
      return { amountStr: clean, amountPaise: toPaise(clean) };
    } catch {}
  }

  // Pattern 3: Number adjacent to credit keywords (e.g. "20.00 received", "received 20.00", "credited 20", "20.00 credited")
  const creditProximityMatch = sanitizedText.match(/(?:credited|received|deposit|payment|paid|transferred|upi|cr)[\s\w:]*?([\d,]+(?:\.\d{1,2})?)|([\d,]+(?:\.\d{1,2})?)[\s\w:]*?(?:credited|received|deposit|payment|paid|transferred|upi|cr)/i);
  if (creditProximityMatch) {
    const rawVal = creditProximityMatch[1] || creditProximityMatch[2];
    if (rawVal) {
      const clean = rawVal.replace(/,/g, '');
      if (/^\d+(\.\d{1,2})?$/.test(clean) && Number(clean) < 10000000 && Number(clean) > 0) {
        try {
          return { amountStr: clean, amountPaise: toPaise(clean) };
        } catch {}
      }
    }
  }

  // Pattern 4: Standalone decimal currency number (e.g. 20.00, 150.50, 449.00)
  const standaloneDecimal = sanitizedText.match(/\b(\d{1,6}\.\d{2})\b/);
  if (standaloneDecimal && standaloneDecimal[1]) {
    const clean = standaloneDecimal[1];
    try {
      return { amountStr: clean, amountPaise: toPaise(clean) };
    } catch {}
  }

  return null;
}

/**
 * Bank and UPI / MFS SMS parser for:
 * SBI, HDFC, ICICI, Axis, Kotak, PNB, bKash, Nagad, Rocket, Paytm, PhonePe, GPay, etc.
 */
export class BankSmsParser {
  /**
   * Parses incoming SMS message text.
   * @param {{
   *   text: string,
   *   sender?: string,
   *   timestamp?: Date | number | string
   * }} sms
   * @returns {{
   *   amountPaise: bigint,
   *   amount: string,
   *   bankReferenceNumber?: string,
   *   senderVpa?: string,
   *   observedAt: Date,
   *   rawText: string
   * } | null}
   */
  static parse(sms) {
    const text = (sms.text || '').trim();
    if (!text) return null;

    // Check if SMS represents an incoming credit
    const creditKeywords = new RegExp(
      '\\b(?:credited|received|deposit(?:ed)?|cash\\s*in|payment\\s+received|money\\s+received|upi\\/cr' +
      '|transferred\\s+to\\s+(?:your\\s+)?(?:a\\/c|account|wallet)' +
      '|payment\\s+of\\s+(?:(?:rs\\b\\.?|inr\\b|tk\\b\\.?|taka\\b|bdt\\b|usd\\b|\\$|[₹৳])\\s*)?[\\d,.]+\\s+(?:has\\s+been\\s+)?made\\s+to\\s+(?:your\\s+)?(?:a\\/c|account|wallet)' +
      '|added\\s+to\\s+(?:your\\s+)?(?:account|wallet))\\b',
      'i'
    );
    if (!creditKeywords.test(text)) {
      return null;
    }

    // Ignore pure debits
    const debitIdx = text.search(/\b(?:debited|withdrawn|deducted|spent|paid rs|sent rs|cash\s*out)\b/i);
    const creditIdx = text.search(/\b(?:credited|received|deposit|deposited|cash\s*in)\b/i);
    if (debitIdx !== -1 && (creditIdx === -1 || debitIdx < creditIdx)) {
      return null;
    }

    // 1. Extract Amount using Intelligent Multi-Pattern Extractor
    const extractedAmount = extractIntelligentAmount(text);
    if (!extractedAmount) {
      return null;
    }

    // 2. Extract Bank Reference / UTR / RRN (including FamPay, bKash TrxID, Nagad TxnID, Rocket TxnId)
    let bankRef;
    const utrPatterns = [
      /(?:upi\s*ref(?:erence)?\s*(?:no\.?|num)?|utr(?:\s*no\.?)?|rrn(?:\s*no\.?)?|trx\s*(?:id|ref|#)?|txn\s*(?:id|ref|#)?|transaction\s*id|ref\s*no\.?)[\s:=-]+([a-zA-Z0-9\-_]{6,35})/i,
      /(?:upi\/(?:[0-9]+\/|cr\/)([a-zA-Z0-9\-_]{6,35}))/i,
      /\b(?:ref(?:\s*(?:no\.?|id|#))?)[:\s#=-]+([a-zA-Z0-9\-_]{6,35})/i,
      /\b([0-9]{12})\b/
    ];

    for (const pat of utrPatterns) {
      const match = text.match(pat);
      if (match && match[1]) {
        bankRef = match[1].trim();
        break;
      }
    }

    // 3. Extract Sender VPA or Phone Number (including bKash, Nagad, Rocket, UPI & FamPay formats)
    let senderVpa;
    let vpaMatch = text.match(/(?:from|by|vpa|upi\s*id|sender)[\s:]+(?:[a-zA-Z\s]+[\(\[])?([a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32}|01[3-9]\d{8}|\+?8801[3-9]\d{8}|\+?91[6-9]\d{9})/i);
    if (!vpaMatch) {
      vpaMatch = text.match(/([a-zA-Z0-9.\-_]{2,64}@[a-zA-Z0-9.\-_]{2,32})/i);
    }
    if (vpaMatch && vpaMatch[1]) {
      senderVpa = vpaMatch[1].trim().replace(/[.,;]+$/, '');
    }

    // 4. Timestamp
    let observedAt = new Date();
    if (sms.timestamp) {
      const parsedTs = new Date(sms.timestamp);
      if (!isNaN(parsedTs.getTime())) {
        observedAt = parsedTs;
      }
    }

    return {
      amountPaise: extractedAmount.amountPaise,
      amount: extractedAmount.amountStr,
      bankReferenceNumber: bankRef,
      senderVpa,
      observedAt,
      rawText: text
    };
  }
}
