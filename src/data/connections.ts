export const billyIdol = {
    billyIdol: {
        first: {
            giver: "Genevieve",
            receiver: "Ozzy",
            episode: 1

        }, second: {
            giver: "Christian",
            receiver: "Aubry",
            episode: 2

        }, third: {

        }
    }
}

export interface Eliminated {
    name: string;
    episode: number;
    type: "tribalCouncil" | "injury";
}

export const eliminated: Eliminated[] = [
    {
        name: "Jenna",
        episode: 1,
        type: "tribalCouncil"
    }, 
    {
        name: "Kyle",
        episode: 1,
        type: "injury"
    },
    {
        name: "Savannah",
        episode: 2,
        type: "tribalCouncil"
    }
]

interface Alliance {
    people: string[];
    target: string;
    episode: number[];
}

export const alliances: Alliance[] = [
    {
        people: [],
        target: "",
        episode: []
    }, 

]