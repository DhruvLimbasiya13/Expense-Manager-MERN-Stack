CREATE DATABASE ExpenseManagerDB;
GO

USE ExpenseManagerDB;
GO

/* ================================
   Expense Manager Database Tables
   ================================ */

-- 1. users
CREATE TABLE users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    UserName VARCHAR(250) NOT NULL,
    EmailAddress VARCHAR(500) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    MobileNo VARCHAR(50) NOT NULL,
    ProfileImage VARCHAR(500),
    Created DATETIME NOT NULL,
    Modified DATETIME NOT NULL
);

-- 2. peoples
CREATE TABLE peoples (
    PeopleID INT PRIMARY KEY IDENTITY(1,1),
    PeopleCode VARCHAR(50),
    Password VARCHAR(50) NOT NULL,
    PeopleName VARCHAR(250) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    MobileNo VARCHAR(50) NOT NULL,
    Description VARCHAR(500),
    UserID INT NOT NULL,
    Created DATETIME NOT NULL,
    Modified DATETIME NOT NULL,
    IsActive BIT,
    CONSTRAINT FK_peoples_users
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- 3. categories
CREATE TABLE categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName VARCHAR(250) NOT NULL,
    LogoPath VARCHAR(250),
    IsExpense BIT NOT NULL,
    IsIncome BIT NOT NULL,
    IsActive BIT NOT NULL,
    Description VARCHAR(500),
    UserID INT NOT NULL,
    Created DATETIME NOT NULL,
    Modified DATETIME NOT NULL,
    Sequence DECIMAL,
    CONSTRAINT FK_categories_users
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- 4. sub_categories
CREATE TABLE sub_categories (
    SubCategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT NOT NULL,
    SubCategoryName VARCHAR(250) NOT NULL,
    LogoPath VARCHAR(250),
    IsExpense BIT NOT NULL,
    IsIncome BIT NOT NULL,
    IsActive BIT NOT NULL,
    Description VARCHAR(500),
    UserID INT NOT NULL,
    Created DATETIME NOT NULL,
    Modified DATETIME NOT NULL,
    Sequence DECIMAL,
    CONSTRAINT FK_subcategories_categories
        FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID),
    CONSTRAINT FK_subcategories_users
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- 5. projects
CREATE TABLE projects (
    ProjectID INT PRIMARY KEY IDENTITY(1,1),
    ProjectName VARCHAR(250) NOT NULL,
    ProjectLogo VARCHAR(250),
    ProjectStartDate DATETIME,
    ProjectEndDate DATETIME,
    ProjectDetail VARCHAR(500),
    Description VARCHAR(500),
    UserID INT NOT NULL,
    Created DATETIME NOT NULL,
    Modified DATETIME NOT NULL,
    IsActive BIT,
    CONSTRAINT FK_projects_users
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- 6. expenses
CREATE TABLE expenses (
    ExpenseID INT PRIMARY KEY IDENTITY(1,1),
    ExpenseDate DATETIME NOT NULL,
    CategoryID INT,
    SubCategoryID INT,
    PeopleID INT NOT NULL,
    ProjectID INT,
    Amount DECIMAL NOT NULL,
    ExpenseDetail VARCHAR(500),
    AttachmentPath VARCHAR(250),
    Description VARCHAR(500),
    UserID INT NOT NULL,
    Created DATETIME NOT NULL,
    Modified DATETIME NOT NULL,
    CONSTRAINT FK_expenses_categories
        FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID),
    CONSTRAINT FK_expenses_subcategories
        FOREIGN KEY (SubCategoryID) REFERENCES sub_categories(SubCategoryID),
    CONSTRAINT FK_expenses_peoples
        FOREIGN KEY (PeopleID) REFERENCES peoples(PeopleID),
    CONSTRAINT FK_expenses_projects
        FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID),
    CONSTRAINT FK_expenses_users
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

-- 7. incomes
CREATE TABLE incomes (
    IncomeID INT PRIMARY KEY IDENTITY(1,1),
    IncomeDate DATETIME NOT NULL,
    CategoryID INT,
    SubCategoryID INT,
    PeopleID INT NOT NULL,
    ProjectID INT,
    Amount DECIMAL NOT NULL,
    IncomeDetail VARCHAR(500),
    AttachmentPath VARCHAR(250),
    Description VARCHAR(500),
    UserID INT NOT NULL,
    Created DATETIME NOT NULL,
    Modified DATETIME NOT NULL,
    CONSTRAINT FK_incomes_categories
        FOREIGN KEY (CategoryID) REFERENCES categories(CategoryID),
    CONSTRAINT FK_incomes_subcategories
        FOREIGN KEY (SubCategoryID) REFERENCES sub_categories(SubCategoryID),
    CONSTRAINT FK_incomes_peoples
        FOREIGN KEY (PeopleID) REFERENCES peoples(PeopleID),
    CONSTRAINT FK_incomes_projects
        FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID),
    CONSTRAINT FK_incomes_users
        FOREIGN KEY (UserID) REFERENCES users(UserID)
);

