# Product Review Portal

Develop a **Product Review Portal** that allows users to create accounts, share product reviews with ratings, categorize reviews, and interact with posts through voting and commenting. Admins will review and moderate content to ensure community standards are met. The portal will be built using modern web technologies to ensure scalability, performance, and maintainability.

---

## Functional Requirements

### 1\. User Roles

- **User**:
    - Register and log in to the portal.
    - Create, edit, and delete their own product reviews.
    - Categorize reviews (e.g., Gadgets, Clothing, Books, etc.).
    - Provide a rating (e.g., 1-5 stars) and optional purchase source (e.g., link or store name).
    - Share positive or negative experiences in reviews.
    - Vote (upvote/downvote) or unvote on reviews.
    - Comment on reviews.
    - Free access to standard reviews
    - Pay one-time fee to:
        - View full premium review content
        - Vote/comment on premium reviews
    - View payment history in profile
- **Admin**:
    - Approve or unpublish user reviews based on community guidelines.
    - View all reviews.
    - Moderate comments and remove inappropriate content (optional).
    - Admin can post premium review.
    - Set price per premium review
    - View payment analytics (total earnings, popular premium reviews)

### 2\. Features

- **Authentication**:
    - User signup/login using email and password.
    - Password hashing for security.
    - JWT-based authentication for session management.
- **Review Management**:
    - Users can create reviews with:
        - Title, description, rating (1-5), category, optional purchase source, and images (optional).
    - Reviews are submitted as drafts and require admin approval to be published.
    - Users can edit/delete their unpublished or published reviews (if not yet moderated).
- **Category System**:
    - Predefined categories by admin (e.g., Gadgets, Clothing, Books) for organizing reviews.
    - Users must select a category when submitting a review.
- **Admin Moderation**:
    - Admins can view a dashboard of all reviews (pending, published, unpublished).
    - Approve or unpublish reviews with a reason (visible to the user).
    - Delete inappropriate comments (optional).
- **Payment Flow**
    1. **Admin creates premium review**:
        - Normal review creation + "Mark as Premium" checkbox
        - Set price (e.g., $5)
    2. **User accesses premium review**:
        - Sees preview (first 100 chars + blurred content)
        - CTA: _"Unlock full review for $X"_
        - Redirects to payment gateway (Stripe/PayPal or any other)
    3. **Post-payment**:
        - Immediate access to full content
        - Ability to vote/comment
        - Receipt confirmation to the user
- **Voting and Commenting**:
    - Users can upvote or downvote reviews (one vote per user per review).
    - Users can remove their vote.
    - Users can post comments on reviews and reply to existing comments.
- **Search and Filter**:
    - Users can search reviews by keyword or filter by name, category, rating, or date.
- **Responsive Design**:
    - The portal must be fully responsive and accessible on desktop and mobile devices.

### 3\. Pages

- **Home Page**:
    - Display a welcoming interface with key portal information
    - Show featured/popular reviews (admin-selected or highest-rated)
    - Include navigation to all other pages
    - Visual elements:
        - Hero section with call-to-action
        - Preview of latest/popular reviews
        - Quick access to categories
        - Basic statistics about the portal (number of reviews, users, etc.)
- **All Reviews Page Requirements**
    - Display all published reviews in a list/grid format
    - Filtering functionality:
        - By category (Gadgets, Clothing, Books, etc.), rating (1-5 stars), date (newest/oldest first), popularity (most voted)
    - Search functionality:
        - Keyword search in review titles/descriptions
    - Pagination for large result sets
    - Each review card must show:
        - Product image (if available)
        - Title
        - Rating (visual stars)
        - Author
        - Date posted
        - Vote count
        - Category badge etc
- **Review Detail Page**
- Complete display of a single review including:
    - Full title
    - Author information
    - Publication date
    - Rating with visual representation
    - Product category
    - Purchase source (if provided)
    - Full review text
    - Images (if any), etc.
- Interactive elements:
    - Voting buttons (upvote/downvote)
    - Comment section:
        - Form to add new comment
        - List of existing comments
        - Reply functionality (optional)
- Edit/Delete buttons (visible only to review author)
- Admin moderation controls (visible only to admins)
- Related reviews section (same category)

---

### **Non-Functional Requirements:**

- **Usability:** Clean, intuitive UI/UX for both users and admins.
- **Maintainability:** Modular, clean, and well-documented code following RESTful API design principles.

---

### **Technology Stack:**

- **Frontend:**
    - **Next.js** (for server-side rendering and static site generation).
    - **Tailwind CSS** (for utility-first styling).
- **Backend:**
    - **Node.js** with **Express.js** (for RESTful API).
    - **Prisma** (for database management).
- **Database:**
    - **PostgreSQL** (for relational data storage).
- **Authentication:**
    - **JWT** (for session management).
- **Payment Integration:**
    - **SSLCommerz** or **ShurjoPay** (for premium subscriptions).
- **Deployment:**
    - Vercel, render, ralway for hosting and deployment.

---
