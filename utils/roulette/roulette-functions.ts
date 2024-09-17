import { Color } from "../firebase/wheel-bets";

export function getNumberColorName(number: number) {
  let color: Color;

  if (number === 0) {
    color = "gold";
  } else if (number % 5 === 0) {
    color = "blue";
  } else if (number % 3 === 0) {
    color = "red";
  } else {
    color = "black";
  }

  return color;
}

export function getNumberColorHex(number: number) {
  let color: string;

  if (number === 0) {
    color = "#f4ce3b";
  } else if (number % 5 === 0) {
    color = "#4c80f1";
  } else if (number % 3 === 0) {
    color = "#cc3c2f";
  } else {
    color = "#545454";
  }
  return color;
}

export function getNumberColor(number: number) {
  let color: Color;

  if (number === 0) {
    color = "gold";
  } else if (number % 5 === 0) {
    color = "blue";
  } else if (number % 3 === 0) {
    color = "red";
  } else {
    color = "black";
  }
  return color;
}

export function getColorHeight(color: string) {
  let height: number;
  if (color == "#545454") {
    height = 25;
  } else if (color == "#cc3c2f") {
    height = 35;
  } else if (color == "#4c80f1") {
    height = 50;
  } else {
    height = 75;
  }
  return height;
}
