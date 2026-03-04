import { useState } from "react";

export const Sidebar = () => {
    const [articles] = useState([
        {
            id: 1,
            title: "My First Note",
            date: "10/24/25",
        },
        {
            id: 2,
            title: "Shopping List",
            date: "10/23/25",
        },
        {
            id: 3,
            title: "Meeting Notes",
            date: "10/22/25",
        },
    ]);

    const [selectedNote, setSelectedNote] = useState(articles[0]);

    return (
        <aside className="notes-sidebar">
            <ul className="notes-list">
                {articles.map((article) => (
                    <li
                        key={article.id}
                        className={`note-item ${
                            selectedNote.id === article.id ? "active" : ""
                        }`}
                        onClick={() => setSelectedNote(article)}
                    >
                        <h3 className="note-item-title">{article.title}</h3>
                        <p className="note-item-date">{article.date}</p>
                    </li>
                ))}
            </ul>
        </aside>
    );
};
