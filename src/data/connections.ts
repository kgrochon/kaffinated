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

        }, 
        third: {
            giver: "Genevieve",
            receiver: "Rizzo",
            episode: 3
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
    },
    {
        name: "Q",
        episode: 3,
        type: "tribalCouncil"
    },
    {
        name: "Mike",
        episode: 4,
        type: "tribalCouncil"
    },
    {
        name: "Charlie",
        episode: 5,
        type: "tribalCouncil"
    },
    {
        name: "Angelina",
        episode: 5,
        type: "tribalCouncil"
    },
    {
        name: "Kamilla",
        episode: 6,
        type: "tribalCouncil"
    },
    {
        name: "Genevieve",
        episode: 6,
        type: "tribalCouncil"
    },
    {
        name: "Colby",
        episode: 6,
        type: "tribalCouncil"
    },
    {
        name: "Dee",
        episode: 7,
        type: "tribalCouncil"
    },
    {
        name: "Coach",
        episode: 8,
        type: "tribalCouncil"
    },
    {
        name: "Chrissy",
        episode: 8,
        type: "tribalCouncil"
    },
    {
        name: "Christian",
        episode: 9,
        type: "tribalCouncil"
    },
    {
        name: "Stephanie",
        episode: 10,
        type: "tribalCouncil"
    }, {
        name: "Emily",
        episode: 11,
        type: "tribalCouncil"
    },
    {
        name: "Ozzy",
        episode: 11,
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