
# Senior Developer's Guide: Monetization Implementation

This guide provides technical steps to transition this UI logic into a production-ready Android application with monetization.

## 1. Enabling Ads (Google AdMob)

To integrate Banner Ads in the Android (Kotlin) version of this app:

1.  **Dependency**: Add the Google Mobile Ads SDK to your `build.gradle`:
    ```kotlin
    implementation("com.google.android.gms:play-services-ads:23.0.0")
    ```
2.  **Manifest**: Add your AdMob App ID in `AndroidManifest.xml`.
3.  **Layout**: Replace the `BannerAd` component with an `AdView` in your XML layout:
    ```xml
    <com.google.android.gms.ads.AdView
        android:id="@+id/adView"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        ads:adSize="BANNER"
        ads:adUnitId="YOUR_BANNER_AD_UNIT_ID" />
    ```
4.  **Activity Logic**:
    ```kotlin
    val adRequest = AdRequest.Builder().build()
    binding.adView.loadAd(adRequest)
    // Only load if user is NOT pro
    if (viewModel.isPro.value == false) {
        binding.adView.visibility = View.VISIBLE
    }
    ```

## 2. Configuring In-App Purchases (Google Play Billing)

To implement the "Pro Version" one-time purchase:

1.  **Dependency**: Add the Billing Library:
    ```kotlin
    implementation("com.android.billingclient:billing-ktx:6.1.0")
    ```
2.  **Product Setup**: Go to the Google Play Console -> Your App -> Monetize -> In-app products. Create a product with ID `pro_upgrade`, Type: Managed Product (One-time).
3.  **Billing Client Initialization**:
    ```kotlin
    val billingClient = BillingClient.newBuilder(context)
        .setListener(purchasesUpdatedListener)
        .enablePendingPurchases()
        .build()
    ```
4.  **Launch Purchase Flow**:
    ```kotlin
    val productList = listOf(QueryProductDetailsParams.Product.newBuilder()
        .setProductId("pro_upgrade")
        .setProductType(BillingClient.ProductType.INAPP)
        .build())

    val params = QueryProductDetailsParams.newBuilder().setProductList(productList).build()
    billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsList ->
        // Use ProductDetails to launch purchase
        val flowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(listOf(BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(productDetailsList[0])
                .build()))
            .build()
        billingClient.launchBillingFlow(activity, flowParams)
    }
    ```
5.  **Persistence**: Once a purchase is successful, store the `isPro` status in **DataStore** or **SharedPreferences**. In a production app, always verify the purchase token on your backend or using the Billing Client's `queryPurchasesAsync` on every app launch.

## 3. Architecture Tip (MVVM)

In the real Kotlin app, use **Room** for local persistence.
- `MonthEntity`: id (string, e.g., "2024-05"), salary (double).
- `ExpenseEntity`: id, monthId (foreign key), name, value, isPaid (boolean).
- Use `Flow` or `LiveData` to observe the database and update the UI automatically.
