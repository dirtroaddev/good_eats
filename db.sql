CREATE TABLE restaurants (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(50) NOT NULL,
    price_range INT NOT NULL check(price_range >= 1 and price_range <= 5)
);


INSERT INTO restaurants (name, location, price_range) values ('mcd', 'new york', 3);
INSERT INTO restaurants (name, location, price_range) values ('wendys', 'vegas', 4);
INSERT INTO restaurants (name, location, price_range) values ('little ceasars', 'florida', 3);
INSERT INTO restaurants (name, location, price_range) values ('country buffett', 'florida', 1);
