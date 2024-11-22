-- Get all organization base information + inventory information
SELECT 
    Organization.organizationID, 
    Organization.Name, 
    Organization.lastActivity, 
    Organization.services, 
    Inventory.Name AS "Inventory Name", 
    Inventory.location AS "Inventory location"
FROM 
    Organization
    INNER JOIN Inventory USING (inventoryID);

-- Get all Converations 
SELECT 
    Conversation.listingID, 
    user1.displayName AS "Participant 1", 
    user2.displayName AS "Participant 2"
FROM 
    Conversation
    INNER JOIN "User" AS user1 ON Conversation.participent1ID = user1.userID
    INNER JOIN "User" AS user2 ON Conversation.participent2ID = user2.userID;

-- Get all relevant Order information
SELECT 
    "Order".orderID,
    "Order".quantity,
    "Order".status,
    Listing.name AS "Listing Name",
    Listing.description AS "Description",
    Part.name AS "inventory Item Name",
    Part.partNumber AS "Part #",
    Model.name AS "Model Name",
    Manufacturer.name AS "Manufacturer Name",
    ownerUser.displayName AS "Owner Name",
    recipientUser.displayName AS "Recipient Name"
FROM 
    "Order"
    INNER JOIN Listing USING (listingID)
    INNER JOIN inventoryItem USING (inventoryItemID)
    INNER JOIN Part USING (partID)
    INNER JOIN Model ON inventoryItem.modelID = Model.modelID
    INNER JOIN Manufacturer ON Model.manufacturerID = Manufacturer.manufacturerID
    INNER JOIN "User" AS ownerUser ON "Order".owner = ownerUser.userID
    INNER JOIN "User" AS recipientUser ON "Order".recipient = recipientUser.userID;


-- Get all relavent information about a listing
SELECT 
    Listing.inventoryItemID,
    "User".displayName AS "Seller",
    Listing.name AS "Listing Name",
    Part.name AS "Part Name",
    Listing.description AS "Description",
    inventoryItem.attributes AS "Attributes",
    Listing.quantity AS "QTY",
    Listing.latitude,
    Listing.longitude,
    Listing.zipcode
FROM 
    Listing
    INNER JOIN "User" USING(userID)
    INNER JOIN inventoryItem USING(inventoryItemID)
    INNER JOIN Part USING(partID);

-- Show all the invites that a specific user has sent
SELECT
    "User".displayName AS "Sender",
    Invite.organizationID,
    Invite.recieverEmail AS "Recipient",
    Invite.description AS "Reason for invite",
    Invite.sentOn,
    Invite.expiresOn,
    Invite.acceptedOn
FROM
    Invite
    INNER JOIN "User" ON Invite.senderID = "User".userID
WHERE 
    Invite.senderID = 3;

-- Show all the conversations that a specific user is in
SELECT 
    Conversation.listingID,
    Listing.name AS "Listing Name", 
    user1.displayName AS "Participant 1", 
    user2.displayName AS "Participant 2"
FROM 
    Conversation
    INNER JOIN "User" AS user1 ON Conversation.participent1ID = user1.userID
    INNER JOIN "User" AS user2 ON Conversation.participent2ID = user2.userID
    INNER JOIN Listing USING (listingID)
WHERE user1.userID =  1 OR  user2.userID = 1;

-- Show all a specific users connections
SELECT 
    user1.displayName AS "Main User",
    user2.displayName AS "Connections"
FROM 
    Connections
    INNER JOIN "User" AS user1 ON Connections.user1ID = user1.userID
    INNER JOIN "User" AS user2 ON Connections.user2ID = user2.userID
WHERE Connections.user1ID = 1;

-- Show all the inventory items in an organization inventories
SELECT
    Organization.Name AS "Organization Name",
    Inventory.name AS "Inventory Name",
    Inventory.parentInventoryID AS "Parent Inventory",
    Inventory.description,
    Inventory.location,
    Manufacturer.name AS "Manufacturer Name",
    Model.name AS "Model Year",
    Model.year,
    Part.name AS "Part Name",
    Part.description,
    Part.partNumber AS "Part #",
    inventoryItem.quantity AS "Total QTY",
    inventoryItem.publicCount AS "Public QTY",
    inventoryItem.notes,
    inventoryItem.attributes
FROM 
    inventoryItem
    INNER JOIN Inventory ON inventoryItem.inventoryID = Inventory.inventoryID
    INNER JOIN Organization ON Inventory.organizationID = Organization.organizationID
    INNER JOIN Part ON inventoryItem.partID = Part.partID
    INNER JOIN Model ON inventoryItem.modelID = Model.modelID
    INNER JOIN Manufacturer ON Model.manufacturerID = Manufacturer.manufacturerID
WHERE
    Inventory.inventoryID = 1 OR Inventory.parentInventoryID = 1;

-- Show all users where rating is < 4.1
SELECT 
    "User".displayName AS "Display name",
    "User".firstName AS "First Name",
    "User".lastName AS "Last Name",
    "User".email,
    "User".accType AS "Account Type", 
    "User".lastActivity, 
    "User".referralCode AS "Referral Code",
    "User".rating AS "Rating"
FROM 
    "User"
WHERE 
    rating < 4.1;

-- Show all users where rating is > 4.1
SELECT 
    "User".displayName AS "Display name",
    "User".firstName AS "First Name",
    "User".lastName AS "Last Name",
    "User".email,
    "User".accType AS "Account Type", 
    "User".lastActivity, 
    "User".referralCode AS "Referral Code",
    "User".rating AS "Rating"
FROM 
    "User"
WHERE 
    rating > 4.1;

-- Show a users bookmarks
SELECT  
    Bookmark.bookmarkID,
    "User".firstName AS "First Name",
    "User".lastName AS "Last Name",
    Listing.name AS "Listing Name",
    Part.name AS "Part Name",
    Listing.description AS "Description",
    inventoryItem.attributes AS "Attributes",
    Listing.quantity AS "QTY",
    Listing.latitude,
    Listing.longitude,
    Listing.zipcode
FROM 
    Bookmark
    INNER JOIN "User" ON Bookmark.userID = "User".userID
    INNER JOIN Listing ON Bookmark.listingID = Listing.listingID
    INNER JOIN inventoryItem ON Listing.inventoryItemID = inventoryItem.inventoryItemID
    INNER JOIN Part ON inventoryItem.partID = Part.partID
WHERE 
    "User".userID = 1;

-- Show all messages from a conversation regarding a specific listing
SELECT 
    Conversation.listingID,
    Listing.name AS "Listing Name", 
    user1.displayName AS "Participant 1", 
    user2.displayName AS "Participant 2",
    Message.messageContent AS "Content"
FROM 
    Conversation
    INNER JOIN "User" AS user1 ON Conversation.participent1ID = user1.userID
    INNER JOIN "User" AS user2 ON Conversation.participent2ID = user2.userID
    INNER JOIN Listing USING (listingID)
    INNER JOIN Message USING (conversationID)
WHERE 
    Listing.listingID = 1;

-- Show all the parts associated with a specific manufacturer
SELECT 
    Model.year AS "Model Year",
    Manufacturer.name AS "Manufacturer Name",
    Model.name AS "Model Name",
    Part.name AS "Part Name",
    Part.description,
    Part.partNumber AS "Part Number"
FROM 
    Part
    INNER JOIN Model USING (modelID)
    INNER JOIN Manufacturer ON Model.manufacturerID = Manufacturer.manufacturerID
WHERE
    Manufacturer.name = 'Mobility Inc';

-- Show all the parts related to a specific model
SELECT 
    Model.year AS "Model Year",
    Manufacturer.name AS "Manufacturer Name",
    Model.name AS "Model Name",
    Part.name AS "Part Name",
    Part.description,
    Part.partNumber AS "Part Number"
FROM 
    Part
    INNER JOIN Model USING (modelID)
    INNER JOIN Manufacturer ON Model.manufacturerID = Manufacturer.manufacturerID
WHERE
    Model.name = 'EasyMove';

-- Show all the parts in a particular type
SELECT 
    Model.year AS "Model Year",
    Manufacturer.name AS "Manufacturer Name",
    Model.name AS "Model Name",
    Part.name AS "Part Name",
    Part.description,
    Part.partNumber AS "Part Number",
    partType.typeName AS "Part Type"
FROM 
    partLinkPartType
    INNER JOIN partType USING (partTypeID)
    INNER JOIN Part USING (partID)
    INNER JOIN Model ON Part.modelID = Model.modelID
    INNER JOIN Manufacturer ON Model.manufacturerID = Manufacturer.manufacturerID
WHERE
    partType.typeName = 'Wheel';