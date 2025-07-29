import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { TenantsModule } from './tenants/tenants.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { BranchModule } from './branch/branch.module';
import { VariantsModule } from './variants/variants.module';
import { VariantInventoriesModule } from './variant-inventories/variant-inventories.module';
import { ProductOptionsModule } from './product-options/product-options.module';
import { ProductOptionValuesModule } from './product-option-values/product-option-values.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    TenantsModule,
    PlansModule,
    SubscriptionsModule,
    ProductOptionsModule,
    ProductOptionValuesModule,
    ProductCategoriesModule,
    ProductsModule,
    VariantInventoriesModule,
    VariantsModule,
    BranchModule
]
})
export class V1Module {}
