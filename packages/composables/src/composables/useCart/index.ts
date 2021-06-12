/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */

import {
  Context,
  useCartFactory,
  UseCartFactoryParams
} from '@vue-storefront/core';
import { Coupon } from '../types';
import { SaleOrder as Cart, SaleOrderLine, Product } from '@vue-storefront/odoo-api/src/types';

const params: UseCartFactoryParams<Cart, SaleOrderLine, Product, Coupon> = {

  load: async (context: Context, { customQuery }) => {

    const cart = await context.$odoo.api.cartLoad({}, customQuery);

    return cart;
  },

  addItem: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    const productId = product.realProduct ? product.realProduct.product_id : product.id;

    if (!params.isInCart(context, { currentCart, product })) {
      await context.$odoo.api.cartAddItem({ productId, quantity }, customQuery);
      const cart = params.load(context, {});

      return cart;
    }

    return currentCart;
  },

  removeItem: async (context: Context, { currentCart, product, customQuery }) => {

    await context.$odoo.api.cartRemoveItem({ productId: product.product.id }, customQuery);

    const cart = params.load(context, {});

    return cart;
  },

  updateItemQty: async (context: Context, { currentCart, product, quantity, customQuery }) => {

    await context.$odoo.api.cartUpdateItemQty({ productId: product.product.id, quantity }, customQuery);

    const cart = params.load(context, {});

    return cart;
  },

  clear: async (context: Context, { currentCart }) => {
    console.log('Mocked: clearCart');
    return currentCart;
  },

  applyCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    console.log('Mocked: applyCoupon');
    return { updatedCart: currentCart, updatedCoupon: {} };
  },

  removeCoupon: async (context: Context, { currentCart, coupon, customQuery }) => {
    console.log('Mocked: removeCoupon');
    return { updatedCart: currentCart };
  },

  isInCart: (context: Context, { currentCart, product }) => {
    console.log(currentCart);

    return currentCart?.orderLine?.some(item => item.product.id == product.id) || false;
  }
};

export default useCartFactory<Cart, SaleOrderLine, Product, Coupon>(params);

