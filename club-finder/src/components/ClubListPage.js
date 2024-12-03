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
            fetchData('http://localhost:5000/api/websites', setWebsites, 'Error fetching websites data')
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

                    //TODO IMPLEMENT WEBSITES && MEETING TIMES

                    return (
                        <div key={club.ClubID} className="accordion-item">
                            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                                {club.ClubName}
                            </div>
                            {activeIndex === index && (
                                <div className="accordion-content">

                                    {/* Description */}
                                    {description?.Description
                                        && <p>{description.Description}</p>
                                    }

                                    {/* Club Contact */}
                                    {contact?.ClubContact
                                        && contact.ClubContact !== "NULL"
                                        && contact.ClubContact !== contact.OfficerContact 
                                        && (<p>Club Contact: {contact.ClubContact}</p>)
                                    }

                                    {/* Club President */}
                                    {contact?.OfficerContact
                                        && contact.OfficerContact !== "NULL"
                                        && (<p>Club President: {contact.OfficerContact}</p>)
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