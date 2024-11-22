CREATE TYPE accountType AS ENUM ('user', 'admin', 'moderator');
CREATE TYPE listingState AS ENUM ('Active', 'Inactive', 'Complete', 'Archived');
CREATE TYPE orderStatus AS ENUM ('Initiated', 'Pending', 'Fulfilled', 'Voided');
CREATE TYPE requestStatus AS ENUM ('Pending', 'Accepted', 'Denied');
CREATE TYPE inviteType AS ENUM ('Organization', 'Site');

CREATE TABLE Inventory(
    inventoryID SERIAL PRIMARY KEY,
    parentInventoryID INT,
    organizationID INT,
    Name VARCHAR(40) NOT NULL,
    description VARCHAR(4000),
    location VARCHAR(100),
    CONSTRAINT inventoryParent FOREIGN KEY (parentInventoryID) REFERENCES Inventory(inventoryID) DEFERRABLE INITIALLY IMMEDIATE
);

CREATE TABLE "User"(
    userID SERIAL PRIMARY KEY,
    organizationID INT NOT NULL,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    displayName VARCHAR(50),
    accType accountType DEFAULT 'user',
    lastActivity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inactive VARCHAR(1) DEFAULT '0',
    referralCode VARCHAR(10) DEFAULT '0000000',
    referredBy INT,
    rating DECIMAL DEFAULT 0.0,
    signupComplete BOOLEAN DEFAULT FALSE
);

CREATE TABLE Organization(
    organizationID SERIAL PRIMARY KEY,
    inventoryID INT NOT NULL,
    userID INT NOT NULL,
    Name VARCHAR(40) NOT NULL,
    lastActivity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inactive VARCHAR(1) DEFAULT '0',
    services VARCHAR(4000),
    rating DECIMAL DEFAULT 0.0,
    addressLine1 VARCHAR(50),
    addressLine2 VARCHAR(50),
    city VARCHAR(30),
    state VARCHAR(15),
    zipcode INT,
    phoneNumber VARCHAR(15),
    FOREIGN KEY (inventoryID) REFERENCES Inventory(inventoryID)
);

-- Add invite expiration date to be dateSent + 14 days
CREATE TABLE Invite(
    inviteID SERIAL PRIMARY KEY,
    senderID INT NOT NULL,
    organizationID INT NOT NULL,
    recieverEmail VARCHAR(40) NOT NULL,
    description VARCHAR(4000),
    invType inviteType NOT NULL, 
    sentOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiresOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acceptedOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderID) REFERENCES "User"(userID),
    FOREIGN KEY (organizationID) REFERENCES Organization(organizationID)
);

CREATE TABLE Connections(
    connectionID SERIAL PRIMARY KEY,
    user1ID INT NOT NULL,
    user2ID INT NOT NULL,
    FOREIGN KEY (user1ID) REFERENCES "User"(userID),
    FOREIGN KEY (user2ID) REFERENCES "User"(userID)
);

CREATE TABLE Manufacturer(
    manufacturerID SERIAL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE modelType(
    modelTypeID SERIAL PRIMARY KEY,
    typeName VARCHAR(30) NOT NULL
);

CREATE TABLE Model(
    modelID SERIAL PRIMARY KEY,
    manufacturerID INT NOT NULL,
    name VARCHAR(30) NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (manufacturerID) REFERENCES Manufacturer(manufacturerID)
);

CREATE TABLE modelLinkModelType(
    modelLinkModelTypeID SERIAL PRIMARY KEY,
    modelID INT NOT NULL,
    modelTypeID INT NOT NULL,
    FOREIGN KEY (modelID) REFERENCES Model(modelID),
    FOREIGN KEY (modelTypeID) REFERENCES modelType(modelTypeID)
);

CREATE TABLE partType(
    partTypeID SERIAL PRIMARY KEY,
    typeName VARCHAR(20) NOT NULL
);

CREATE TABLE Part(
    partID SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(4000),
    modelID INT NOT NULL,
    partNumber VARCHAR(30),
    FOREIGN KEY (modelID) REFERENCES Model(modelID)
);

CREATE TABLE partLinkPartType(
    partLinkPartTypeID SERIAL PRIMARY KEY,
    partID INT NOT NULL,
    partTypeID INT NOT NULL,
    FOREIGN KEY (partID) REFERENCES Part(partID),
    FOREIGN KEY (partTypeID) REFERENCES partType(partTypeID)
);

CREATE TABLE inventoryItem(
    inventoryItemID SERIAL PRIMARY KEY,
    partID INT NOT NULL,
    modelID INT NOT NULL,
    inventoryID INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    publicCount INT DEFAULT 0,
    notes VARCHAR(4000),
    attributes VARCHAR(4000),
    FOREIGN KEY (partID) REFERENCES Part(partID),
    FOREIGN KEY (modelID) REFERENCES Model(modelID),
    FOREIGN KEY (inventoryID) REFERENCES Inventory(inventoryID)
);

CREATE TABLE Listing(
    listingID SERIAL PRIMARY KEY,
    inventoryItemID INT NOT NULL,
    userID INT NOT NULL,
    name VARCHAR(40) NOT NULL,
    description VARCHAR(4000),
    attributes VARCHAR(4000),
    quantity INT DEFAULT 1,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    inactive VARCHAR(1) DEFAULT '0',
    zipcode VARCHAR(10) NOT NULL,
    state listingState DEFAULT 'Active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventoryItemID) REFERENCES inventoryItem(inventoryItemID),
    FOREIGN KEY (userID) REFERENCES "User"(userID)
);

CREATE TABLE "Order"(
    orderID SERIAL PRIMARY KEY,
    listingID INT NOT NULL,
    owner INT NOT NULL,
    recipient INT NOT NULL,
    quantity INT NOT NULL,
    status orderStatus,
    dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dateCompleted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listingID) REFERENCES Listing(listingID),
    FOREIGN KEY (owner) REFERENCES "User"(userID),
    FOREIGN KEY (recipient) REFERENCES "User"(userID)
);

CREATE TABLE Bookmark(
    bookmarkID INT NOT NULL,
    userID INT NOT NULL,
    listingID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES "User"(userID),
    FOREIGN KEY (listingID) REFERENCES Listing(listingID)
);

CREATE TABLE Conversation(
    conversationID SERIAL PRIMARY KEY,
    listingID INT DEFAULT NULL,
    participent1ID INT NOT NULL,
    participent2ID INT NOT NULL,
    FOREIGN KEY (listingID) REFERENCES Listing(listingID),
    FOREIGN KEY (participent1ID) REFERENCES "User"(userID),
    FOREIGN KEY (participent2ID) REFERENCES "User"(userID)
);

CREATE TABLE Message(
    messageID SERIAL PRIMARY KEY,
    senderID INT NOT NULL,
    conversationID INT NOT NULL,
    messageContent VARCHAR(4000),
    readStatus TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderID) REFERENCES "User"(userID),
    FOREIGN KEY (conversationID) REFERENCES Conversation(conversationID)
);

CREATE TABLE Tag(
    tagID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE inventoryItemLinkTag(
    inventoryItemLinkTagID SERIAL PRIMARY KEY,
    inventoryItemID INT NOT NULL,
    tagID INT NOT NULL,
    FOREIGN KEY (inventoryItemID) REFERENCES inventoryItem(inventoryItemID),
    FOREIGN KEY (tagID) REFERENCES Tag(tagID)
);

CREATE TABLE Request(
    requestID SERIAL PRIMARY KEY,
    approverID INT NOT NULL,
    EIN VARCHAR(9) NOT NULL,
    firstName VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    email VARCHAR(30) NOT NULL,
    description VARCHAR(4000) NOT NULL,
    sentOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actionTakenOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status requestStatus,
    FOREIGN KEY (approverID) REFERENCES "User"(userID)
);

CREATE TABLE Review(
    reviewID SERIAL PRIMARY KEY,
    reviewerID INT NOT NULL,
    reviewedUserID INT NOT NULL,
    orderID INT NOT NULL,
    description VARCHAR(4000) NOT NULL,
    rating INT,
    sentOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewerID) REFERENCES "User"(userID),
    FOREIGN KEY (reviewedUserID) REFERENCES "User"(userID),
    FOREIGN KEY (orderID) REFERENCES "Order"(orderID)
);

-- Add foreign key constraints after data insertion
ALTER TABLE "User"
    ADD CONSTRAINT user_organization_fkey FOREIGN KEY (organizationID) REFERENCES organization(OrganizationID) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Organization
    ADD CONSTRAINT organization_owner_fkey FOREIGN KEY (userID) REFERENCES "User"(userID) DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE Inventory
    ADD CONSTRAINT inventory_owner_fkey FOREIGN KEY (organizationID) REFERENCES Organization(organizationID) DEFERRABLE INITIALLY IMMEDIATE;

