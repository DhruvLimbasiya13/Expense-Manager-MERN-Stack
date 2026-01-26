function CategoryList({ categories, expenses, incomes, currentUser }) {
  const isAdmin = currentUser.role === "admin";

  // 1. Filter Transactions based on Role (Admin sees all, User sees theirs)
  const myExpenses = isAdmin
    ? expenses
    : expenses.filter((e) => Number(e.userId) === Number(currentUser.id));

  const myIncomes = isAdmin
    ? incomes
    : incomes.filter((i) => Number(i.userId) === Number(currentUser.id));

  // 2. Helper to Calculate Total per Category
  const getCategoryTotal = (category) => {
    if (category.isExpense) {
      return myExpenses
        .filter((e) => Number(e.categoryId) === Number(category.id))
        .reduce((sum, e) => sum + Number(e.amount), 0);
    } else if (category.isIncome) {
      return myIncomes
        .filter((i) => Number(i.categoryId) === Number(category.id))
        .reduce((sum, i) => sum + Number(i.amount), 0); 
    }
    return 0;
  };

  // 3. Helper to Count Transactions per Category
  const getTransactionCount = (category) => {
    if (category.isExpense) {
      return myExpenses.filter(
        (e) => Number(e.categoryId) === Number(category.id)
      ).length;
    } else if (category.isIncome) {
      return myIncomes.filter(
        (i) => Number(i.categoryId) === Number(category.id)
      ).length;
    }
    return 0;
  };

  // 4. FILTER LOGIC:
  // - Admin: Sees ALL categories (even empty ones)
  // - User: Sees only categories they have used (count > 0)
  const linkedCategories = categories.filter(
    (cat) => getTransactionCount(cat) > 0
  );
  const categoriesToShow = isAdmin ? categories : linkedCategories;

  return (
    <div className="container mt-5 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Categories</h2>
          <p className="text-muted">
            {isAdmin
              ? "Master list of all categories and company-wide totals."
              : "Overview of categories with active transactions."}
          </p>
        </div>
      </div>

      <div className="row g-4">
        {categoriesToShow.map((cat) => {
          const total = getCategoryTotal(cat);
          const count = getTransactionCount(cat);
          const isExp = cat.isExpense;

          return (
            <div className="col-md-6 col-lg-4" key={cat.id}>
              <div className="card custom-card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  {/* Header: Name and Type Badge */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold text-dark mb-0">{cat.name}</h5>
                    <span
                      className={`badge ${
                        isExp ? "bg-danger" : "bg-success"
                      } bg-opacity-10 ${
                        isExp ? "text-danger" : "text-success"
                      } px-3 py-2 rounded-pill`}
                    >
                      {isExp ? "Expense" : "Income"}
                    </span>
                  </div>

                  {/* Total Amount Display */}
                  <div className="mb-3">
                    <small
                      className="text-muted text-uppercase fw-bold"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Total {isExp ? "Spent" : "Earned"}
                    </small>
                    <h3
                      className={`fw-bold mb-0 ${
                        isExp ? "text-dark" : "text-success"
                      }`}
                    >
                      ₹ {total.toLocaleString()}
                    </h3>
                  </div>

                  {/* Footer: Transaction Count & Status */}
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="text-muted small">
                      {count} {count === 1 ? "Transaction" : "Transactions"}
                    </div>
                    {/* Badge logic: If count > 0 it's Active, else it's Unused (for Admin view) */}
                    {count > 0 ? (
                      <span className="badge bg-light text-secondary border">
                        Active
                      </span>
                    ) : (
                      <span className="badge bg-light text-muted border">
                        Unused
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {categoriesToShow.length === 0 && (
          <div className="col-12 text-center text-muted py-5">
            <p>No categories found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryList;
