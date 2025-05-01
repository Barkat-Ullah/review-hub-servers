# Product Review Portal

The **Product Review Portal** is a modern web application where users can share, browse, and interact with product reviews. It supports user-generated content, voting, commenting, premium reviews, and admin moderation — all powered by a robust and scalable stack using Next.js, Node.js, Prisma, and PostgreSQL.

---

## Functional Requirements

### 1\. User Roles

- **User**:

    - Register/login with email and password
    - Create, edit, and delete product reviews
      Categorize reviews (e.g., Gadgets, Clothing, Books)

    - Rate products (1–5 stars) and share purchase info

    - Vote (upvote/downvote) and comment on reviews

    - Access free content

    - Purchase and access premium reviews

- **Admin**:

    - Approve, unpublish, or delete reviews

    - Moderate comments (optional)

    - Create and mark reviews as premium with custom price

    - View analytics on premium review sales
    - The portal must be fully responsive and accessible on desktop and mobile devices.

---

### **Technology Stack:**

- **Frontend:**

    - Next.js – React framework with SSR and SSG

    - Tailwind CSS – Utility-first CSS framework

- **Backend:**

    - Node.js + Express.js – REST API backend

    - Prisma – ORM for PostgreSQL

    - PostgreSQL – Relational database

- **Authentication:**

    - JWT (JSON Web Tokens) – Stateless authentication

- **Payment Integration:**

    - SSLCommerz / ShurjoPay – One-time payment for premium reviews

---

### Scripts

- npm run dev - Start the development server.
- npm run build - Build the application.
- npm run lint - Run ESLint to check for code issues.
- npm run lint:fix - Fixed to some errors automatically.

### Getting Started

#### Prerequisites

Ensure you have the following installed:

- Node.js v20
- npm

#### Installation

1. Clone the repository:

```js
git clone https://github.com/MdSaifulIslamRafsan/l2-a9-backend.git
cd product-review-portal
```

2. Install dependencies:

```js
npm install
```

3. Set up environment variables:

```js
PORT = 5000;
DATABASE_URL = your_db_url;
```

#### Usage

- Run the development server:

```js
npm run dev
```

- build for production:

```js
npm run build
```

- check the EsLint error:

```js
npm run lint
```

- fix the EsLint error:

```js
npm run lint:fix
```

### Thank You
