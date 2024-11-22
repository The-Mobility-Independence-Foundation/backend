TRUNCATE Inventory, "User", Organization, Invite, Connections, Manufacturer, Model, modelLinkModelType, partType, Part, partLinkPartType, inventoryItem, Listing, "Order", Bookmark, Conversation, Message, Tag, inventoryItemLinkTag, Request, Review;

BEGIN;
SET CONSTRAINTS ALL DEFERRED;
-- Insert data into the Inventory table
INSERT INTO Inventory (inventoryID, organizationID, parentInventoryID, Name, description, location)
VALUES 
    (1, 1, NULL, 'Main Inventory', 'Central warehouse inventory.', '123 Main St'),
    (2, 1, 1, 'Electronics Inventory', 'Electronics and gadgets.', '124 Electronics St'),
    (3, 1, 1, 'Office Supplies Inventory', 'Office supplies stock.', '125 Office St'),
    (4, 2, NULL, 'Warehouse Inventory', 'General warehouse stock.', 'Warehouse District');

-- Insert data into the User table
INSERT INTO "User" (userID, organizationID, firstName, lastName, email, password, displayName, accType, lastActivity, inactive, referralCode, referredBy, rating)
VALUES 
    (1, 1, 'John', 'Doe', 'john.doe@example.com', 'password123', 'JohnD', 'admin', CURRENT_TIMESTAMP, '0', 'ABC123', NULL, 4.5),
    (2, 2, 'Jane', 'Smith', 'jane.smith@example.com', 'securepass', 'JaneS', 'user', CURRENT_TIMESTAMP, '0', 'XYZ456', 1, 4.0),
    (3, 3, 'Michael', 'Johnson', 'm.johnson@example.com', 'passw0rd', 'MikeJ', 'moderator', CURRENT_TIMESTAMP, '0', 'LMN789', 2, 4.2),
    (4, 4, 'Emily', 'Brown', 'emily.brown@example.com', 'password321', 'EmilyB', 'user', CURRENT_TIMESTAMP, '0', 'DEF012', 3, 3.8);

-- Insert data into the Organization table
INSERT INTO Organization (organizationID, inventoryID, userID,  Name, lastActivity, inactive, services, rating, addressLine1, addressLine2, city, state, zipcode, phoneNumber)
VALUES 
    (1, 1, 1, 'Alpha Tech Solutions', CURRENT_TIMESTAMP, '0', 'IT consulting, Software development', 4.5, '123 Tech Lane', NULL, 'San Francisco', 'CA', 94105, '415-555-1234'), 
    (2, 2, 2, 'Beta Electronics', CURRENT_TIMESTAMP, '0', 'Gadget retail, Electronics repair', 3.8, '456 Electronics Blvd', 'Suite 200', 'Los Angeles', 'CA', 90001, '323-555-5678'),
    (3, 3, 3, 'Gamma Office Supplies', CURRENT_TIMESTAMP, '0', 'Stationery sales, Office supplies rental', 4.2, '789 Office Dr', 'Apt 101', 'Seattle', 'WA', 98101, '206-555-9012'), 
    (4, 4, 4, 'Delta Warehouse Services', CURRENT_TIMESTAMP, '0', 'Storage services, Logistics', 4.0, '321 Logistics Rd', NULL, 'Portland', 'OR', 97204, '503-555-3456');

-- Insert data into Invite table
INSERT INTO Invite (senderID, organizationID, recieverEmail, description, invType, sentOn, expiresOn, acceptedOn)
VALUES
    (1, 1, 'alex.brown@example.com', 'Invitation to join organization', 'Organization',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
    (2, 2, 'sara.green@example.com', 'Invitation to join organization', 'Organization',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
    (3, 3, 'lisa.white@example.com', 'Invitation to join organization','Organization',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
    (3, 1, 'jon.frost@example.com', 'Wants to join the site', 'Site',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
    (4, 1, 'mike.blue@example.com', 'Invitation to join organization', 'Organization',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

-- Insert data into Connections table
INSERT INTO Connections (user1ID, user2ID)
VALUES
    (1, 2),
    (2, 3),
    (3, 4),
    (1, 4);

-- Insert data into Manufacturer table
INSERT INTO Manufacturer (name)
VALUES
    ('Mobility Inc'),
    ('Access Corp'),
    ('Wheel Solutions'),
    ('Assistive Innovations');

-- Insert data into modelType table
INSERT INTO modelType (typeName)
VALUES
    ('Electric'),
    ('Manual'),
    ('Sports'),
    ('Portable');

-- Insert data into Model table
INSERT INTO Model (manufacturerID, name, year)
VALUES
    (1, 'EasyMove', 2023),
    (2, 'PowerGlide', 2022),
    (3, 'FlexiWheel', 2021),
    (4, 'SportRider', 2024);

-- Insert data into modelLinkModelType table
INSERT INTO modelLinkModelType (modelID, modelTypeID)
VALUES
    (1, 1),
    (2, 1),
    (3, 2),
    (4, 3);

-- Insert data into partType table
INSERT INTO partType (typeName)
VALUES
    ('Battery'),
    ('Wheel'),
    ('Joystick'),
    ('Seat');

-- Insert data into Part table
INSERT INTO Part (name, description, modelID, partNumber)
VALUES
    ('Lithium Battery', 'High capacity lithium battery.', 1, 'LB123'),
    ('Front Wheel', 'Durable rubber front wheel.', 2, 'FW456'),
    ('Joystick Controller', 'Joystick for precise control.', 3, 'JC789'),
    ('Comfort Seat', 'Adjustable padded seat.', 4, 'CS012');

-- Insert data into partLinkPartType table
INSERT INTO partLinkPartType (partID, partTypeID)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4);

-- Insert data into inventoryItem table
INSERT INTO inventoryItem (partID, modelID, inventoryID, quantity, publicCount, notes, attributes)
VALUES
    (1, 1, 1, 10, 5, 'Brand new batteries', 'Color: Black'),
    (2, 2, 2, 15, 7, 'Heavy-duty wheels', 'Size: 8 inches'),
    (3, 3, 3, 5, 3, 'Standard joystick', 'Material: Plastic'),
    (3, 3, 1, 5, 3, 'new joystick', 'Material: Plastic'),
    (4, 4, 4, 8, 4, 'Comfortable seats', 'Color: Blue');

-- Insert data into Listing table
INSERT INTO Listing (inventoryItemID, userID, name, description, attributes, quantity, latitude, longitude, zipcode)
VALUES
    (1, 1, 'Item A', 'Description for Item A', 'Attributes for Item A', 5, 40.748817, -73.985428, '10001'),
    (2, 2, 'Item B', 'Description for Item B', 'Attributes for Item B', 3, 40.749641, -73.987472, '10002'),
    (3, 3, 'Item C', 'Description for Item C', 'Attributes for Item C', 2, 40.752726, -73.977229, '10003'),
    (4, 4, 'Item D', 'Description for Item D', 'Attributes for Item D', 1, 40.754932, -73.984016, '10004');

-- Insert date into the Bookmark table
INSERT INTO Bookmark (bookmarkID, userID, listingID)
VALUES
    (1, 1, 4),
    (2, 2, 3),
    (3, 3, 2),
    (4, 4, 1);

-- Insert data into Order table
INSERT INTO "Order" (listingID, owner, recipient, quantity, status, dateCreated, dateCompleted)
VALUES
    (1, 1, 2, 2, 'Fulfilled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 2, 3, 1, 'Pending', CURRENT_TIMESTAMP, NULL),
    (3, 3, 4, 1, 'Initiated', CURRENT_TIMESTAMP, NULL),
    (4, 4, 1, 1, 'Voided', CURRENT_TIMESTAMP, NULL);

-- Insert data into Conversation table
INSERT INTO Conversation (listingID, participent1ID, participent2ID)
VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 3, 4),
    (4, 4, 1);

-- Insert data into Message table
INSERT INTO Message (senderID, conversationID, messageContent)
VALUES
    (1, 1, 'Is this item still available?'),
    (2, 1, 'Yes, it is available.'),
    (3, 3, 'What is the delivery time?'),
    (4, 4, 'Can you ship this to my location?');

-- Insert data into the Tag table
INSERT INTO Tag (name) VALUES 
    ('Electronics'), 
    ('Home Appliance'), 
    ('Furniture'), 
    ('Outdoor Equipment');

-- Insert data into the inventoryItemLinkTag
INSERT INTO inventoryItemLinkTag(inventoryItemID, tagID)
VALUES  
    (1, 4),
    (2, 3),
    (3, 2),
    (1, 3),
    (4, 1);
COMMIT;