import React, { useState, useEffect } from 'react';
import '../style/ClubListPage.css';
import '../style/Accordion.css';
import { useLocation } from "react-router-dom";

// Searches the backend via url to fetch data from our database
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

// Main
const FilteredList = () => {

  // Initializing all arrays needed to store incoming data
  const [activeIndex, setActiveIndex] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [meetingTimes, setMeetingTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Searches all necessary api pages for club data
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
        setError(error);
        setLoading(false);
      }
    };

    searchAPI();
  }, []);

  // Sets an accordion menu's index to 'active', triggering it to expan
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

  // Converts a time from military time to AMPM time
  const convertTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);

    const isAM = hours < 12;
    const newHour = hours % 12 || 12;
    const ampm = isAM ? 'AM' : 'PM';

    const minutesFormatted = minutes.toString().padStart(2, '0');

    return `${newHour}:${minutesFormatted} ${ampm}`;
  };

  // Orders an array based on the day of the week (starting with Sunday)
  const sortMeetingTimes = (meetingTimes) => {
    const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    return meetingTimes.sort((a, b) => {
      const dayIndexA = dayOrder.indexOf(a.DayOfWeek);
      const dayIndexB = dayOrder.indexOf(b.DayOfWeek);
  
      return dayIndexA - dayIndexB;
    });
  };

  const sortedMeetingTimes = sortMeetingTimes(meetingTimes);

  return (
    <div className="club-list-page">
      <h1>Clubs You Might Be Interested In</h1>
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
                    && (<p><strong><u>Club Contact:</u></strong> <a href={`mailto:${contact.ClubContact}`}><i>{contact.ClubContact}</i></a></p>)
                  }

                  {/* Club President */}
                  {contact?.OfficerContact
                    && contact.OfficerContact !== "NULL"
                    && (<p><strong><u>Club President:</u></strong> <a href={`mailto:${contact.OfficerContact}`}><i>{contact.OfficerContact}</i></a></p>)
                  }

                  {/* Websites */}
                  { (website?.URL || instagram?.URL) && (
                      <p><strong><u>Websites:</u> </strong>
                        {instagram?.URL && <a href={instagram.URL} target="_blank" rel="noopener noreferrer"><i>Instagram</i></a>}
                        {website?.URL && instagram?.URL && ', '}
                        {website?.URL && <a href={website.URL} target="_blank" rel="noopener noreferrer"><i>Club Site</i></a>}
                        
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
                              <strong>{time.DayOfWeek}</strong> - {convertTime(time.StartTime)} to {convertTime(time.EndTime)} @ {time.Location}
                            </li>
                          ))}
                        </ul>
                      </div>
                      ) : (
                        <div className="club-list-page">
                          <i>Meeting times are not currently available for this club.</i>
                        </div>
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
} // Main

export default FilteredList;