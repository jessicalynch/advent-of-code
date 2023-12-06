export function makeMap(block) {
  return (input) => {
    const numMap = block.match(/\d+/g).map(Number);
    for (let i = 0; i < numMap.length; i += 3) {
      const destVal = numMap[i];
      const sourceVal = numMap[i + 1];
      const mapRange = numMap[i + 2];
      if (input < sourceVal || input >= sourceVal + mapRange) {
        continue;
      }
      return input - sourceVal + destVal;
    }
    return input;
  };
}

export function getMaps(blocks) {
  return {
    seedToSoil: makeMap(blocks[1]),
    soilToFertilizer: makeMap(blocks[2]),
    fertilizerToWater: makeMap(blocks[3]),
    waterToLight: makeMap(blocks[4]),
    lightToTemperature: makeMap(blocks[5]),
    temperatureToHumidity: makeMap(blocks[6]),
    humidityToLocation: makeMap(blocks[7]),
  };
}

export function seedToLocation(seed, maps) {
  const soil = maps.seedToSoil(seed);
  const fertilizer = maps.soilToFertilizer(soil);
  const water = maps.fertilizerToWater(fertilizer);
  const light = maps.waterToLight(water);
  const temperature = maps.lightToTemperature(light);
  const humidity = maps.temperatureToHumidity(temperature);
  const location = maps.humidityToLocation(humidity);
  return location;
}
