export default function calculateScore(distance: number, difficultyMultiplier: number) {
    // TODO:
    // BUILD THIS SCORE OUT WITH SOME MAX CAP, CLEAN NUMBERS, ETC
    const distanceM = distance*1000;
    console.log(distanceM);
    let score:number= 0;
    if (distanceM < 10) {
        return 200*difficultyMultiplier;
    }
    score = 2/distance;

    return ~~(score*difficultyMultiplier); //~~is basically just math.floor() but faster
}