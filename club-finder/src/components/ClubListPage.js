import React, {useState, useEffect} from 'react';
import '../style/ClubListPage.css';
import '../style/Accordion.css';

function ClubListPage() {
    const [clubs, setClubs] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    // Fetches all needed data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
        try {

            // Clubs
            const clubsResponse = await fetch("http://localhost:5000/api/clubs");
            if (!clubsResponse.ok) {
            throw new Error("Error fetching clubs data");
            }
            const clubsData = await clubsResponse.json();
            setClubs(clubsData);

            // Contacts
            const contactsResponse = await fetch("http://localhost:5000/api/contacts");
            if (!contactsResponse.ok) {
            throw new Error("Error fetching contacts data");
            }
            const contactsData = await contactsResponse.json();
            setContacts(contactsData);

            // Descriptions
            const descriptionsResponse = await fetch("http://localhost:5000/api/descriptions");
            if (!descriptionsResponse.ok) {
            throw new Error("Error fetching descriptions data");
            }
            const descriptionsData = await descriptionsResponse.json();
            setDescriptions(descriptionsData);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data");
            setLoading(false);  // Stop loading even if there's an error
        }

        };

        fetchData();  // Trigger data fetching when component mounts
    }, []); // Empty dependency array to run once when the component mounts

    const toggleAccordion = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null);
        } else {
            setActiveIndex(index);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="club-list-page">
            <h1>List of Clubs</h1>
                <div className="accordion">
                    {clubs.map((club, index) => {
                        const contact = contacts.find(contact => contact.ClubID === club.ClubID);
                        const description = descriptions.find(description => description.ClubID === club.ClubID);
                        return (
                            <div key={club.ClubID} className="accordion-item">
                                <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                    {club.ClubName}
                                </div>
                                {activeIndex === index && (
                                    <div className="accordion-content"> 
                                        <p>{description?.Description || 'No description info'}</p>
                                        <p>Club Contact: {contact?.ClubContact || 'No contact info'}</p>
                                        <p>Club President: {contact?.OfficerContact || 'No contact info'}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
        </div>
    );
}

export default ClubListPage;