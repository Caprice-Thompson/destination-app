import { faker } from '@faker-js/faker';
import fs from 'fs';

const generateEarthquakeData = () => {
    return {
        features: Array.from({ length: 10 }, () => ({
            properties: {
                mag: parseFloat(faker.number.float({ min: 1, max: 7, fractionDigits: 1 }).toFixed(1)),
                place: faker.location.city(),
                time: faker.date.past().getTime(),
                type: "earthquake",
                tsunami: faker.number.int({ min: 0, max: 5 }),
            }
        }))
    };
};

const json = JSON.stringify(generateEarthquakeData(), null, 2);

fs.writeFile("./src/api/db.json", json, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log("Mock data generated.");
});
