import { Climb } from "../components/Game";
import _ from 'lodash';


export function getRandomFromClimbIDs(numBoulders: number, allClimbs: Array<Climb>) {
    const climbs :Array<Climb> = [];

    for (let i = 0; i < numBoulders; i++) {
        // get random element from climbIDs
        const range: number = allClimbs.length;
        climbs.push(allClimbs[_.random(0, range)])
    }

    console.log(climbs);

    return climbs;
}