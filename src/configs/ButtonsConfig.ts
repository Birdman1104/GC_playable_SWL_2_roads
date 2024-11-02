import { ButtonType } from "../models/ButtonModel";
import { PRICES } from "./constants";

export const BUTTONS_CONFIG = [
  {
    type: ButtonType.Food,
    price: PRICES.food
  },
  {
    type: ButtonType.Joy,
    price: PRICES.joy
  },
  {
    type: ButtonType.Health,
    price: PRICES.health
  },
  {
    type: ButtonType.House,
    price: PRICES.house
  },
]