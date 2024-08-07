export const calRewardSigdaoOnSelfie = (bmi: number) => {

  const bmiString = bmi.toString();
  const calBmi = parseFloat(bmiString);



  if (calBmi >= 18.5 && calBmi <= 22.9) {
    return 5.42 * 10 ** 6
  } else if ((calBmi > 22.9 && calBmi <= 23.4) || (calBmi >= 18 && calBmi < 18.5)) {
    return 3.94 * 10 ** 6
  } else if ((calBmi > 23.4 && calBmi <= 23.7) || (calBmi >= 17.7 && calBmi < 18)) {
    return 2.63 * 10 ** 6
  } else {
    return 1.31 * 10 ** 6
  }


}
// Healthy
// Overweight
// Obese
export const calBMIType = (bmi: number) => {
  if (bmi < 18.5){
    return {
      type: "Underweight",
      color: "#4136F1"
    }
  } else if (bmi >= 18.5 && bmi <= 22.9) {
    return {
      type: "Healthy",
      color: "#39B3AF"
    }
  } else if (bmi > 22.9 && bmi <= 24.9) {
    return {
      type: "Overweight",
      color: "#FF9F3E"
    }
  } else {
    return {
      type: "Obese",
      color: "var(--hot-magenta)"
    }
  }
}