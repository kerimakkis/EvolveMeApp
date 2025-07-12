db = db.getSiblingDB('evolveme');
db.createCollection('users');
db.createCollection('goals');
db.createCollection('habits');
db.createCollection('journalentries');
print('Database and collections created successfully.');