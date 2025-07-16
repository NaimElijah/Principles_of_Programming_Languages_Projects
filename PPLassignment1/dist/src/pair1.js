"use strict";
let inventory1 = [{ name: "abc", price: 50, discounted: false }, { name: "abcd", price: 70, discounted: true }, { name: "abc", price: 100, discounted: true }, { name: "abc", price: 100, discounted: true }];
const getDiscountedProductAveragePrice = (inventory) => {
    let discountedPriceSum = 0;
    let discountedProductsCount = 0;
    for (const product of inventory) {
        if (product.discounted) {
            discountedPriceSum += product.price;
            discountedProductsCount++;
        }
    }
    if (discountedProductsCount === 0) {
        return 0;
    }
    return discountedPriceSum / discountedProductsCount;
};
console.log(getDiscountedProductAveragePrice(inventory1));
const sum = (inventory) => inventory.filter((x) => x.discounted).map(x => x.price)
    .reduce((acc, curr) => acc + curr, 0);
const amount = (inventory) => inventory.filter((x) => x.discounted).length;
const average = (inventory) => sum(inventory) / amount(inventory);
console.log(average(inventory1));
//# sourceMappingURL=pair1.js.map