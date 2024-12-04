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
  const [meetingTimes, setMeetingTimes] = useState([]);
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

  const sortMeetingTimes = (meetingTimes) => {
    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    return meetingTimes.sort((a, b) => {
      const dayIndexA = dayOrder.indexOf(a.DayOfWeek);
      const dayIndexB = dayOrder.indexOf(b.DayOfWeek);
  
      // Compare based on the day of the week order
      return dayIndexA - dayIndexB;
    });
  };

  const sortedMeetingTimes = sortMeetingTimes(meetingTimes);

  return (
    <div className="club-list-page">
      <h1>List of Clubs</h1>
      <div className="accordion">
        {clubs.map((club, index) => {
          const contact = contacts.find(contact => contact.ClubID === club.ClubID);
          const description = descriptions.find(description => description.ClubID === club.ClubID);

          // Sorts allWebsites into regular websites and instagram pages
          const allWebsites = websites.filter(website => website.ClubID === club.ClubID);
          const website = allWebsites.find(website => website.Instagram.data[0] === 0);
          const instagram = allWebsites.find(instagram => instagram.Instagram.data[0] === 1);

          // Filter the meeting times for the current club
          const allMeetingTimes = sortedMeetingTimes.filter(time => time.ClubID === club.ClubID);

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
                    && (<p><strong><u>Club Contact:</u></strong> <a href={`mailto:${contact.ClubContact}`}>{contact.ClubContact}</a></p>)
                  }

                  {/* Club President */}
                  {contact?.OfficerContact
                    && contact.OfficerContact !== "NULL"
                    && (<p><strong><u>Club President:</u></strong> <a href={`mailto:${contact.OfficerContact}`}>{contact.OfficerContact}</a></p>)
                  }

                  {/* Websites */}
                  { (website?.URL || instagram?.URL) && (
                      <p><strong>Websites: </strong>
                        {instagram?.URL && <a href={instagram.URL} target="_blank" rel="noopener noreferrer">Instagram</a>}
                        {website?.URL && instagram?.URL && ', '}
                        {website?.URL && <a href={website.URL} target="_blank" rel="noopener noreferrer">Club Site</a>}
                        
                      </p>
                  )}
                                
                  <div className="club-list-page-left">

                    {/* Meeting Times */}
                    {allMeetingTimes.length > 0 ? (
                      <div>
                        <strong><u>Meeting Times (subject to change)</u></strong>
                        <ul>
                          {allMeetingTimes.map((time, idx) => (
                            <li key={idx}>
                              <strong>{time.DayOfWeek}</strong> - {time.StartTime} to {time.EndTime} @ {time.Location}
                            </li>
                          ))}
                        </ul>
                      </div>
                      ) : (
                        <p><i>Meeting times are not currently available for this club.</i></p>
                      )
                    }

                  </div> {/* club-list-page-right */}
                </div> // accordion-content
              )} {/* activeIndex */}
            </div> // accordion-item
          ); // interior return
        })} {/* clubs map */}
      </div> {/* accordion */}
    </div> // club-list-page
  ); // exterior return
} // ClubListPage function

export default ClubListPage;