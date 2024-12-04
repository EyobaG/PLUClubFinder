import React, { useState, useEffect } from 'react';
import '../style/ClubListPage.css';
import '../style/Accordion.css';

const fetchData = async (url, setState, errorMessage) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    const data = await response.json();
    setState(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const ClubListPage = () => {
  const [clubs, setClubs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [meeetingTimes, setMeetingTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const searchAPI = async () => {
      try {
        await Promise.all([
            fetchData('http://localhost:5000/api/clubs', setClubs, 'Error fetching clubs data'),
            fetchData('http://localhost:5000/api/contacts', setContacts, 'Error fetching contacts data'),
            fetchData('http://localhost:5000/api/descriptions', setDescriptions, 'Error fetching descriptions data'),
            fetchData('http://localhost:5000/api/websites', setWebsites, 'Error fetching websites data'),
            fetchData('http://localhost:5000/api/meeting-times', setMeetingTimes, 'Error fetching meeting time data')
        ]);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false); // Stop loading even in case of an error
      }
    };

    searchAPI();
  }, []);

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

                    // Sorts all websites into regular websites and instagram pages
                    const allWebsites = websites.filter(website => website.ClubID === club.ClubID);
                    const website = allWebsites.find(website => website.Instagram.data[0] === 0);
                    const instagram = allWebsites.find(instagram => instagram.Instagram.data[0] === 1);

                    // TODO IMPLEMENT MEETING TIMES

                    // Accordion Items
                    return (
                        <div key={club.ClubID} className="accordion-item">
                            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                {club.ClubName}
                            </div>
                            {activeIndex === index && (
                                <div className="accordion-content">

                                    {/* Description */}
                                    {description?.Description
                                        && description.Description !== "NULL" ? (
                                            <p>{description.Description}</p>
                                        ) : (
                                            <p><i>No description available right now. Try contacting the club's leaders for more information!</i></p>
                                        )
                                    }

                                    {/* Club Contact */}
                                    {contact?.ClubContact
                                        && contact.ClubContact !== "NULL"
                                        && contact.ClubContact !== contact.OfficerContact 
                                        && (<p><strong>Club Contact: </strong><a href={`mailto:${contact.ClubContact}`}>{contact.ClubContact}</a></p>)
                                    }

                                    {/* Club President */}
                                    {contact?.OfficerContact
                                        && contact.OfficerContact !== "NULL"
                                        && (<p><strong>Club President: </strong><a href={`mailto:${contact.OfficerContact}`}>{contact.OfficerContact}</a></p>)
                                    }
                                    
                                    {/* Website */}
                                    {website?.URL
                                        && website.URL !== "NULL"
                                        && (<p><a href={website.URL} target="_blank" rel="noopener noreferrer"><strong>Club Website</strong></a></p>)
                                    }

                                    {/* Instagram */}
                                    {instagram?.URL
                                        && instagram.URL !== "NULL"
                                        && (<p><a href={instagram.URL} target="_blank" rel="noopener noreferrer"><strong>Instagram</strong></a></p>)
                                    }

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