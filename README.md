# Product API Documentation

## GET All Products
`GET /api/trpc/public.product.getAll`

Fetches paginated, filterable, and sortable product listings for a specific store.

### Request

#### Headers
| Key | Value | Required | Description |
|-----|-------|----------|-------------|
| `x-store-slug` | Store slug (e.g., `dry-fruits`) | Yes | Identifies the store |

#### Query Parameters
All parameters are optional. Default values are shown below.

```json
{
  "page": 1,
  "limit": 12,
  "category": "",
  "search": "",
  "sortBy": "createdAt",
  "sortOrder": "desc",
  "minPrice": null,
  "maxPrice": null,
  "inStock": null
}
```

## JavaScript Fetch:- 
```js
        const input = {
          page,
          limit: 8,
        };

        const serialized = superjson.stringify(input);

        const url = `${
          process.env.NEXT_PUBLIC_DASHBOARD_URL
        }/api/trpc/public.product.getAll?input=${encodeURIComponent(
          serialized
        )}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "x-store-slug": Array.isArray(storeSlug) ? storeSlug[0] : storeSlug,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched products:", data);

        if (data?.result?.data?.json) {
          setStoreData(data.result.data.json);
        } else {
          throw new Error("Invalid data format");
        }
```


### Basic Request
```bash
curl -X GET \
  'https://storekit.app/api/trpc/public.product.getAll?input={"page":1,"limit":12}' \
  -H 'x-store-slug: dry-fruits'
```

### Filtered Request
```bash
curl -X GET \
  'https://storekit.app/api/trpc/public.product.getAll?input={"category":"nuts","minPrice":10,"maxPrice":20,"inStock":true}' \
  -H 'x-store-slug: dry-fruits'
```


### Success Response (200 ok):-
```json
{
  "products": [
    {
      "id": "prod_123",
      "name": "Premium Almonds",
      "description": "Organic California almonds",
      "price": 12.99,
      "stock": 100,
      "image": "https://...",
      "category": "nuts",
      "createdAt": "2023-01-15T10:30:00Z",
      "inStock": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4,
    "hasNext": true,
    "hasPrev": false
  }
}
```




## GET Product by ID
`GET /api/trpc/public.product.getById`

Fetches a single product by its ID for a specific store.

### Request

#### Headers
| Key | Value | Required | Description |
|-----|-------|----------|-------------|
| `x-store-slug` | Store slug (e.g., `dry-fruits`) | Yes | Identifies the store |
| `Content-Type` | `application/json` | Yes | Request content type |

#### Request Body
```json
{
  "id": "cmc3795t2000bnx0kqrt5x371"
}
```


## JavaScript Fetch:-
```js
        const input = { id: productId };
        // 2. Serialize with SuperJSON
        const serialized = superjson.stringify(input);

        // 3. Make the request
        const url = `http://localhost:3000/api/trpc/public.product.getById?input=${encodeURIComponent(
          serialized
        )}`;

        const res = await fetch(url, {
          headers: {
            "x-store-slug": Array.isArray(storeSlug) ? storeSlug[0] : storeSlug,
            "Content-Type": "application/json",
          },
        });

        // 4. Deserialize the response
        const rawData = await res.json();
        const data = superjson.parse(JSON.stringify(rawData));

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        // const data = await res.json();
        console.log("Full response:", rawData);

        if (rawData?.result?.data?.json) {
          setProductDetails(rawData.result.data.json);
        } else {
          throw new Error("Invalid data format");
        }
```

### Response:- 
```json
{
  "id": "cmc3795t2000bnx0kqrt5x371",
  "name": "Premium Almonds",
  "description": "Organic California almonds",
  "price": 12.99,
  "stock": 100,
  "image": "https://example.com/almonds.jpg",
  "category": "nuts",
  "createdAt": "2023-01-15T10:30:00Z",
  "inStock": true
}
```

# Product Categories API Documentation

## GET Product Categories
`GET /api/trpc/storefront.products.getCategories`

Retrieves all unique product categories with product counts for a specific store.

### Request

#### Headers
| Key | Value | Required | Description |
|-----|-------|----------|-------------|
| `x-store-slug` | Store slug (e.g., `dry-fruits`) | Yes | Identifies the store |

### Response

#### Success Response (200 OK)
```json
[
  {
    "name": "nuts",
    "count": 15
  },
  {
    "name": "dried-fruits",
    "count": 8
  },
  {
    "name": "spices",
    "count": 12
  }
]
```

### cURL Request
```bash
curl -X GET \
  'https://storekit.app/api/trpc/storefront.products.getCategories' \
  -H 'x-store-slug: dry-fruits'
 ``` 

### JavaScript Fetch
```js
fetch('https://storekit.app/api/trpc/storefront.products.getCategories', {
  method: 'GET',
  headers: {
    'x-store-slug': 'dry-fruits'
  }
})
.then(response => response.json())
.then(data => console.log(data));
```





# Order  API Documentation


## GET All Orders
`GET /api/trpc/storefront.orders.getAll`

Retrieves paginated orders with filtering capabilities for a specific store.

## Request

### Headers
| Key | Value | Required | Description |
|-----|-------|----------|-------------|
| `x-store-slug` | Store slug (e.g., `dry-fruits`) | Yes | Identifies the store |

### Query Parameters
All parameters are optional. Default values shown:

```json
{
  "page": 1,
  "limit": 10,
  "status": null,
  "customerEmail": null,
  "dateFrom": null,
  "dateTo": null
}
```

## JavaScript Fetch:-
```js
        const res = await fetch(
          "http://localhost:3000/api/trpc/storefront.orders.getAll",
          {
            method: "GET",
            headers: {
              "x-store-slug": Array.isArray(storeSlug)
                ? storeSlug[0]
                : storeSlug,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched orders:", data);
        setOrdersData(data.result.data.json);
```

## Success Response (200 ok)
```json
{
  "orders": [
    {
      "id": "ord_123",
      "total": 59.97,
      "status": "PROCESSING",
      "createdAt": "2023-05-15T14:32:00Z",
      "customer": {
        "id": "cust_456",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "itemCount": 3,
      "items": [
        {
          "id": "item_789",
          "quantity": 2,
          "price": 12.99,
          "product": {
            "id": "prod_123",
            "name": "Premium Almonds",
            "image": "https://...",
            "category": "nuts"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```


## GET Order Statistics
`GET /api/trpc/storefront.orders.getStats`

Retrieves order statistics and metrics for a specific store.

### Request

#### Headers
| Key | Value | Required | Description |
|-----|-------|----------|-------------|
| `x-store-slug` | Store slug (e.g., `dry-fruits`) | Yes | Identifies the store |

### Response

#### Success Response (200 OK)
```json
{
  "result": {
    "data": {
      "json": {
        "totalOrders": 42,
        "totalRevenue": 1250.75,
        "pendingOrders": 5,
        "deliveredOrders": 32,
        "cancelledOrders": 3,
        "processingOrders": 2
      }
    }
  }
}
```