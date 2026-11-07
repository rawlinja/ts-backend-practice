import type { MerchantSettlement, Transaction } from './types.js';

function createMerchantSettlement(
	transaction: Transaction,
): MerchantSettlement {
	const { merchantId, currency } = transaction;
	return {
		merchantId,
		currency,
		netMinor: 0,
		transactionCount: 0,
	};
}

export function buildMerchantSettlements(
	transactions: Transaction[],
): MerchantSettlement[] {
	const settlementByMerchantId = new Map<
		string,
		Map<string, MerchantSettlement>
	>();

	for (const transaction of transactions) {
		if (transaction.status === 'pending' || transaction.status === 'failed') {
			continue;
		}

		const { merchantId, currency, type, amountMinor } = transaction;

		if (!settlementByMerchantId.has(merchantId)) {
			settlementByMerchantId.set(merchantId, new Map());
		}

		const currentSettlementByCurrency = settlementByMerchantId.get(merchantId)!;

		if (!currentSettlementByCurrency.has(currency)) {
			currentSettlementByCurrency.set(
				currency,
				createMerchantSettlement(transaction),
			);
		}

		const currentSettlement = currentSettlementByCurrency.get(currency)!;

		let { netMinor, transactionCount } = currentSettlement;

		transactionCount += 1;

		if (type === 'charge') {
			netMinor += amountMinor;
		}

		if (type === 'chargeback' || type === 'refund') {
			netMinor -= amountMinor;
		}

		currentSettlementByCurrency.set(currency, {
			...currentSettlement,
			netMinor,
			transactionCount,
		});
	}

	const merchantSettlement = Array.from(
		settlementByMerchantId.values(),
	).flatMap((settlementByCurrencyMap) =>
		Array.from(settlementByCurrencyMap.values()),
	);

	return [...merchantSettlement].sort(
		(a, b) =>
			a.merchantId.localeCompare(b.merchantId) ||
			a.currency.localeCompare(b.currency),
	);
}
