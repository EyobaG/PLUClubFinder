import React, { useState, useEffect } from 'react';
import '../style/ClubListPage.css';
import '../style/Accordion.css';

function ClubListPage() {
    const [clubs, setClubs] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [websites, setWebsites] = useState([]);
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

                // Websites
                const websitesResponse = await fetch("http://localhost:5000/api/websites"); // Assuming this is the API endpoint for websites
                if (!websitesResponse.ok) {
                    throw new Error("Error fetching websites data");
                }
                const websitesData = await websitesResponse.json();
                setWebsites(websitesData);

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
                    const clubWebsites = websites.filter(website => website.ClubID === club.ClubID); // Filter websites for the current club
                    const website = clubWebsites.find(site => site.URL && !site.instagram); // Assuming website URLs contain "google.com"
                    const instagram = clubWebsites.find(site => site.URL && site.instagram); // Assuming Instagram URLs contain "instagram.com"

                    return (
                        <div key={club.ClubID} className="accordion-item">
                            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                {club.ClubName}
                            </div>
                            {activeIndex === index && (
                                <div className="accordion-content">

                                    {/* Description */}
                                    {description?.Description && description.Description !== "NULL" && (
                                        <p>{description.Description}</p>
                                    )}

                                    {/* Club Contact, if exists */}
                                    {contact?.ClubContact && contact.ClubContact !== "NULL" && (
                                        <p>Club Contact: {contact.ClubContact}</p>
                                    )}

                                    {/* Club President, if exists */}
                                    {contact?.OfficerContact && contact.OfficerContact !== "NULL" && (
                                        <p>Club President: {contact.OfficerContact}</p>
                                    )}
                                    
                                    {/* Club Website, if exists */}
                                    {website && website.URL !== "NULL" && (
                                        <p>Club Website:
                                            <a href={website.URL} target="_blank" rel="noopener noreferrer">
                                                 {website.URL}
                                            </a>
                                        </p>
                                    )}

                                    {/* Club Instagram, if exists */}
                                    {instagram && instagram.URL !== "NULL" && (
                                        <p>Instagram:
                                            <a href={instagram.URL} target="_blank" rel="noopener noreferrer">
                                                 {instagram.URL}
                                            </a>
                                        </p>
                                    )}
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
