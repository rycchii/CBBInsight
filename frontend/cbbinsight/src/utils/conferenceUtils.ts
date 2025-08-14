export const getConferenceAbbreviation = (conferenceName: string): string => {
  const abbreviations: { [key: string]: string } = {
    // Power 5 Conferences
    'atlantic coast': 'ACC',
    'big ten': 'Big Ten',
    'big 12': 'Big 12',
    'southeastern': 'SEC',
    'pac-12': 'PAC-12',
    'big east': 'Big East',
    
    // Other Major Conferences
    'american athletic': 'AAC',
    'atlantic 10': 'A-10',
    'conference usa': 'CUSA',
    'mountain west': 'MW',
    'west coast': 'WCC',
    'missouri valley': 'MVC',
    'colonial athletic': 'CAA',
    'Horizon': 'HL',
    'metro atlantic athletic': 'MAAC',
    'mid-american': 'MAC',
    'ohio valley': 'OVC',
    'southern': 'SoCon',
    'southland': 'Southland',
    'sun belt': 'SBC',
    'western athletic': 'WAC',
    
    // Smaller Conferences
    'america east': 'AEC',
    'atlantic sun': 'A-SUN',
    'big sky': 'Big Sky',
    'big south': 'Big South',
    'big west': 'Big West',
    'northeast': 'NEC',
    'patriot league': 'Patriot',
    'summit league': 'Summit',
    'southwest athletic': 'SWAC',
    'mid-eastern athletic': 'MEAC',
    'ivy league': 'Ivy',
    
    // Independent
    'independent': 'IND'
  }
  
  const normalizedName = conferenceName.toLowerCase().trim()
  return abbreviations[normalizedName] || conferenceName.toUpperCase().substring(0, 3)
}

// Default fallback logo
export const getDefaultSchoolLogo = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNmM3NTdkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TY2hvb2w8L3RleHQ+Cjwvc3ZnPg=='
}

// Sports Reference logo mapping
export const getSportsReferenceLogos = (): { [key: string]: string } => {
  const logoMap: { [key: string]: string } = {}
  
  const schoolMappings: { [key: string]: string } = {
    // Major Schools
    'Duke': 'duke',
    'North Carolina': 'north-carolina',
    'Kentucky': 'kentucky',
    'Kansas': 'kansas',
    'UCLA': 'ucla',
    'Arizona': 'arizona',
    'Michigan': 'michigan',
    'Ohio State': 'ohio-state',
    'Florida': 'florida',
    'Texas': 'texas',
    'Virginia': 'virginia',
    'Villanova': 'villanova',
    'Syracuse': 'syracuse',
    'Connecticut': 'connecticut',
    'Georgetown': 'georgetown',
    'Marquette': 'marquette',
    'Providence': 'providence',
    'Seton Hall': 'seton-hall',
    'St Johns': 'st-johns-ny',
    'Xavier': 'xavier',
    'Creighton': 'creighton',
    'Butler': 'butler',
    'DePaul': 'depaul',
    
    // ACC
    'Florida State': 'florida-state',
    'Georgia Tech': 'georgia-tech',
    'Virginia Tech': 'virginia-tech',
    'NC State': 'north-carolina-state',
    'Wake Forest': 'wake-forest',
    'Boston College': 'boston-college',
    'Clemson': 'clemson',
    'Pittsburgh': 'pittsburgh',
    'Louisville': 'louisville',
    'Notre Dame': 'notre-dame',
    'Miami': 'miami-fl',
    
    // SEC
    'Alabama': 'alabama',
    'Auburn': 'auburn',
    'Arkansas': 'arkansas',
    'Georgia': 'georgia',
    'LSU': 'louisiana-state',
    'Mississippi': 'mississippi',
    'Mississippi State': 'mississippi-state',
    'Missouri': 'missouri',
    'South Carolina': 'south-carolina',
    'Tennessee': 'tennessee',
    'Texas A&M': 'texas-am',
    'Vanderbilt': 'vanderbilt',
    
    // Big Ten
    'Illinois': 'illinois',
    'Indiana': 'indiana',
    'Iowa': 'iowa',
    'Maryland': 'maryland',
    'Michigan State': 'michigan-state',
    'Minnesota': 'minnesota',
    'Nebraska': 'nebraska',
    'Northwestern': 'northwestern',
    'Penn State': 'penn-state',
    'Purdue': 'purdue',
    'Rutgers': 'rutgers',
    'Wisconsin': 'wisconsin',
    
    // Big 12
    'Baylor': 'baylor',
    'Iowa State': 'iowa-state',
    'Kansas State': 'kansas-state',
    'Oklahoma': 'oklahoma',
    'Oklahoma State': 'oklahoma-state',
    'TCU': 'texas-christian',
    'Texas Tech': 'texas-tech',
    'West Virginia': 'west-virginia',
    
    // Pac-12
    'Arizona State': 'arizona-state',
    'California': 'california',
    'Colorado': 'colorado',
    'Oregon': 'oregon',
    'Oregon State': 'oregon-state',
    'Stanford': 'stanford',
    'USC': 'southern-california',
    'Utah': 'utah',
    'Washington': 'washington',
    'Washington State': 'washington-state',
    
    // Other notable schools
    'Gonzaga': 'gonzaga',
    'Memphis': 'memphis',
    'Cincinnati': 'cincinnati',
    'Houston': 'houston',
    'SMU': 'southern-methodist',
    'Temple': 'temple',
    'Tulane': 'tulane',
    'Wichita State': 'wichita-state',
    'VCU': 'virginia-commonwealth',
    'Dayton': 'dayton',
    'Saint Louis': 'saint-louis',
    'Richmond': 'richmond',
    'George Washington': 'george-washington',
    'George Mason': 'george-mason'
  }
  
  Object.entries(schoolMappings).forEach(([school, slug]) => {
    logoMap[school] = `https://www.sports-reference.com/cbb/schools/${slug}/logos/logo.png`
  })
  
  return logoMap
}

// Main function to get all team logos
export const fetchAllTeamLogos = async (): Promise<{ [key: string]: string }> => {
  try {
    const logoMap = getSportsReferenceLogos()
    console.log(`Loaded ${Object.keys(logoMap).length} Sports Reference logos`)
    return logoMap
  } catch (error) {
    console.error('Error fetching Sports Reference logos:', error)
    return {}
  }
}

// Helper function to get logo from map with fallback
export const getSchoolLogoFromMap = (schoolName: string, logoMap: { [key: string]: string }): string | null => {
  // Direct match first
  if (logoMap[schoolName]) {
    return logoMap[schoolName]
  }
  
  // Try variations
  const variations = [
    schoolName,
    schoolName.replace(' State', ''),
    schoolName.replace(' University', ''),
    schoolName + ' State',
    schoolName + ' University'
  ]
  
  for (const variation of variations) {
    if (logoMap[variation]) {
      return logoMap[variation]
    }
  }
  
  // Try partial matches
  const partialMatch = Object.keys(logoMap).find(teamName => 
    teamName.toLowerCase().includes(schoolName.toLowerCase()) ||
    schoolName.toLowerCase().includes(teamName.toLowerCase())
  )
  
  return partialMatch ? logoMap[partialMatch] : null
}