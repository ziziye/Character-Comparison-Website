import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';

export default function RecentComparison() {
  const { user } = useUser();  

  return (
    <div style={{ width: "100%", height: "200px", overflow: "auto" }}>
      <h2>Recent Comparisons</h2>
      <ul>
        {user.recentComparison && user.recentComparison.length > 0 ? (
          user.recentComparison.map((item, index) => (
            <li key={index}>
              {item.name0} vs {item.name1}
            </li>
          ))
        ) : (
          <li>No comparison history.</li>  // Message displayed when the array is empty
        )}
      </ul>
    </div>
  );
}
