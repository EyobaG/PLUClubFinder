/* TODO:
 * 
 * - Fix duplicate clubs appearing
 * - Implement websites and meeting times in the accordion
 * - Fix logic/db pertaining to athletic and athleticserious/nonserious tags
 * */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../style/ClubListPage.css';
import '../style/Accordion.css';


// Function to fetch filtered data
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


// Main FilteredList Component
const FilteredList = () => {
  const location = useLocation(); // Access location object
  const { answers } = location.state || {};

  const [activeIndex, setActiveIndex] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [meetingTimes, setMeetingTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filtered club data based on quiz answers
  useEffect(() => {
    const searchAPI = async () => {
      try {
        // Fetch club data
        const response = await fetch('http://localhost:5000/api/quiz-answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers),
        });

        if (!response.ok) {
          throw new Error('Error fetching clubs data');
        }

        const data = await response.json();
        setClubs(data);

        // Fetch websites and meeting times concurrently
        const websitesPromise = fetchData('http://localhost:5000/api/websites', setWebsites, 'Error fetching websites data');
        const meetingTimesPromise = fetchData('http://localhost:5000/api/meeting-times', setMeetingTimes, 'Error fetching meeting time data');

        // Wait for both fetches to complete
        await Promise.all([websitesPromise, meetingTimesPromise]);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (answers) {
      searchAPI(); // Only fetch if `answers` are available
    }
  }, [answers]);

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
    return <div>{error.message}</div>;
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
    <div className="filtered-list-page">
      <h1>Your Results!</h1>
      <div className="accordion">
        {clubs.map((club, index) => {
          // Filter and find websites for each club
          const allWebsites = websites.filter(website => website.ClubID === club.ClubID);
          const website = allWebsites.find(website => website.Instagram.data[0] === 0);
          const instagram = allWebsites.find(instagram => instagram.Instagram.data[0] === 1);

          // Filter the meeting times for the current club
          const allMeetingTimes = sortedMeetingTimes.filter(time => time.ClubID === club.ClubID);
  
          return (
            <div key={`${club.ClubID}-${index}`} className="accordion-item">
              <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                {club.ClubName}
              </div>
              {activeIndex === index && (
                <div className="accordion-content">
  
                  {/* Description */}
                  {club.Description && club.Description !== 'NULL' ? (
                    <p>{club.Description}</p>
                  ) : (
                    <p><i>No description available right now. Try contacting the club's leaders for more information!</i></p>
                  )}
  
                  {/* Club Contact */}
                  {club?.ClubContact
                    && club.ClubContact !== "NULL"
                    && club.ClubContact !== club.PresidentEmail 
                    && (<p><strong><u>Club Contact:</u></strong> <a href={`mailto:${club.ClubContact}`}><i>{club.ClubContact}</i></a></p>)
                  }
  
                  {/* Club President */}
                  {club?.PresidentEmail
                    && club.PresidentEmail !== "NULL"
                    && (<p><strong><u>Club President:</u></strong> <a href={`mailto:${club.PresidentEmail}`}><i>{club.PresidentEmail}</i></a></p>)
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
                    
                  </div> {/* club-list-page-left */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilteredList;
