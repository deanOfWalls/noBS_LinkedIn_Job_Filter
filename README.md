#noBS LinkedIn Job Filter

##Identifying URL Parameters
1. Location ('location'): ZIP code, city, or country. URL-encoded.
2. Distance ('distance'): Distance in miles or km from the location.
3. Experience Level ('f_E'): Filters by experience level.
4. Time Posted ('f_TPR'): Filters by time job was posted.

##User Input Fields
1. Location: ZIP code or country.
2. Positive Terms: Terms to include in search.
3. Negative Terms: Terms to exclude from search.

##Challenges and Solutions
*Location Auto-fill*
-Challenge: Linked-in's search bar has an auto-fill feature for locations.
-Solution: Use a ZIP code to city/state/coutnry mapping API and for countries use a pre-defined list.
	
*Formatting Search Terms*
-Challenge: Search terms need to be formatted correctly for URL encoding
-Solution: Programatically format positive and negative search terms.