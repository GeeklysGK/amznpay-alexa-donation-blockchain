const amountToJpy = (amount: number) => new Intl
  .NumberFormat("ja-JP", {style: 'currency', currency: 'JPY'}).format(amount);

export default amountToJpy;