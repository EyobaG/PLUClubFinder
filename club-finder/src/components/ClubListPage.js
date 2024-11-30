import React, {useState, useEffect} from 'react';
import '../style/ClubListPage.css';

function ClubListPage() {
  const [clubs, setClubs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="club-list-page">
      <h1>List of Clubs</h1>
      {clubs.length > 0 ? (
        <ul>
          {clubs.map(club => {
            const contact = contacts.find(contact => contact.ClubID === club.ClubID);
            const description = descriptions.find(description => description.ClubID === club.ClubID);
            return (
              <li key={club.ClubID}>
                {club.ClubName}, {contact?.ClubContact || 'No contact info'} <br />
                Desc: {description?.Description || 'No description info'}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No clubs available</p>
      )}
    </div>
  );
}

export default ClubListPage;

/*const ClubListPage = () => {
    const sampleClubs = ["Drama Club", "Chess Club", "Coding Club", "Photography Club"];
    
    return (
        <div className="club-list-page">
            <h1>List of Clubs</h1>
            <ul className="club-list">
                {sampleClubs.map((club, index) => (
                    <li key={index}>{club}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClubListPage;*/