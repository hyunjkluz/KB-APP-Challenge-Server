module.exports = {
  category: (...args) => {
    let histories = args[0];

    let food = {
      "category" : 0,
      "cnt": 0,
      "total": 0,
      "percentage": 0,
      "history": []
    }
    let shop = {
      "category" : 1,
      "cnt": 0,
      "total": 0,
      "percentage": 0,
      "history": []
    }
    let culture = {
      "category" : 2,
      "cnt": 0,
      "total": 0,
      "percentage": 0,
      "history": []
    }
    let accommodation = {
      "category" : 3,
      "cnt": 0,
      "total": 0,
      "percentage": 0,
      "history": []
    }
    let flight = {
      "category" : 4,
      "cnt": 0,
      "total": 0,
      "percentage": 0,
      "history": []
    }

    for (let i = 0; i < histories.length; i++) {
      let attr = histories[i];
      if (attr.isIncome == 0) { //지출일 때
        if (attr.category == 0) { //식/음료 일 때
          food.cnt += 1;
          food.total += attr.sum;
          food.history.push(attr)
        } else if (attr.category == 1) { //쇼핑
          shop.cnt += 1;
          shop.total += attr.sum;
          shop.history.push(attr)
        } else if (attr.category == 2) { //문화
          culture.cnt += 1;
          culture.total += attr.sum;
          culture.history.push(attr)
        } else if (attr.category == 3) { //숙소
          accommodation.cnt += 1;
          accommodation.total += attr.sum;
          accommodation.history.push(attr)
        } else { //항공
          flight.cnt += 1;
          flight.total += attr.sum;
        }
      } else continue;
    }

    let totalSum = food.total + shop.total + culture.total + accommodation.total + flight.total;
    food.percentage = Math.floor((food.total / totalSum) * 100);
    shop.percentage = Math.floor((shop.total / totalSum) * 100);
    culture.percentage = Math.floor((culture.total / totalSum) * 100);
    accommodation.percentage = Math.floor((accommodation.total / totalSum) * 100);
    flight.percentage = Math.floor((flight.total / totalSum) * 100);

    let categories = [food, shop, culture, accommodation, flight];
    return categories;
  }
}