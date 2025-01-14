import { formatPhoneNumber } from './formatters';

// Map the school creation body
export const mapSchoolCreationBody = ({ data }) => {
  return {
    data: {
      name: data.name,
      type: data.type,
      region: data.region,
      department: data.department,
      commune: data.commune,
      address: data.address,
      email: data.email,
      phone: formatPhoneNumber(data.phone),
      phoneFix: data.phoneFix || null,
      creationDate: data.creationDate,
      isAlAzharLand: data.isAlAzharLand || false,
      note: data.note || '',
      IA: data.IA,
      IEF: data.IEF,
      responsibleName: data.responsibleName,
      city: data.city,
      postBox: data.postBox,
      etablissementParent: data.etablissementParent || null,
    },
  };
};

// Map school data for a DataTable-friendly format
export const mapSchoolsDataTable = ({ schools }) => {
  if (schools && Array.isArray(schools.data) && schools.data.length) {
    return schools.data.map((school) => {
      const {
        id,
        attributes: {
          name,
          type,
          etablissementParent,
          region,
          department,
          commune,
          address,
          email,
          phone,
          phoneFix,
          creationDate,
          isAlAzharLand,
          note,
          IA,
          IEF,
          responsibleName,
          city,
          postBox,
        },
      } = school;

      return {
        id,
        name,
        type,
        etablissementParent:
          etablissementParent?.data?.attributes.name || 'N/A',
        region,
        department,
        commune,
        address: address || 'N/A',
        email: email || 'N/A',
        phone: formatPhoneNumber(phone || 'N/A'),
        phoneFix: phoneFix || 'N/A',
        creationDate: creationDate || 'N/A', //formatDate(creationDate)
        isAlAzharLand: isAlAzharLand ? 'Yes' : 'No',
        note: note || 'N/A',
        IA: IA || 'N/A',
        IEF: IEF || 'N/A',
        responsibleName: responsibleName || 'N/A',
        city: city || 'N/A',
        postBox: postBox || 'N/A',
      };
    });
  }
  return [];
};

// Categorize schools based on type
const typeCategories = ['Centre', 'Centre Secondaire', 'Annexe'];

const getCategory = (type) => {
  if (typeCategories.includes(type)) {
    return type.toLowerCase().replace(/\s+/g, '_'); // Convert type to a slug-like format
  }
  return null;
};

// Map schools by their type
export const mapSchoolsByType = ({ schools }) => {
  const categorizedData = {
    centre: [],
    centre_secondaire: [],
    annexe: [],
  };

  if (schools?.data?.length) {
    schools.data.forEach(({ id, attributes }) => {
      const { type, name, region, department } = attributes;
      const category = getCategory(type);

      if (category) {
        categorizedData[category].push({
          id,
          name,
          region,
          department,
        });
      }
    });
  }

  return categorizedData;
};

// Transform school data into select options
export const mapToOptions = ({ schools }) => {
  if (schools && Array.isArray(schools.data)) {
    return schools.data.map((school) => ({
      name: school.attributes.name,
      value: school.id,
    }));
  }
  return [];
};

export const getRegions = () => Object.keys(senegalRegions);
// Senegal regions

const senegalRegions = {
  Dakar: ['Dakar', 'Guédiawaye', 'Pikine', 'Rufisque'],
  Diourbel: ['Bambey', 'Diourbel', 'Mbacké'],
  Fatick: ['Fatick', 'Foundiougne', 'Gossas'],
  Kaffrine: ['Birkelane', 'Kaffrine', 'Koungheul', 'Malem Hodar'],
  Kaolack: ['Guinguinéo', 'Kaolack', 'Nioro du Rip'],
  Kédougou: ['Kédougou', 'Salemata', 'Saraya'],
  Kolda: ['Kolda', 'Médina Yoro Foulah', 'Vélingara'],
  Louga: ['Kébémer', 'Linguère', 'Louga'],
  Matam: ['Kanel', 'Matam', 'Ranérou'],
  'Saint-Louis': ['Dagana', 'Podor', 'Saint-Louis'],
  Sédhiou: ['Bounkiling', 'Goudomp', 'Sédhiou'],
  Tambacounda: ['Bakel', 'Goudiry', 'Koumpentoum', 'Tambacounda'],
  Thiès: ["M'bour", 'Thiès', 'Tivaouane'],
  Ziguinchor: ['Bignona', 'Oussouye', 'Ziguinchor'],
};

const communesByDepartment = {
  Dakar: ['Almadies', 'Plateau', 'Hann Bel-Air', 'Grand Dakar'],
  Guédiawaye: ['Golf Sud', 'Médina Gounass', 'Ndiarème Limamoulaye'],
  Pikine: ['Pikine Est', 'Pikine Nord', 'Pikine Sud'],
  Rufisque: ['Bargny', 'Diamniadio', 'Sangalkam'],
  Bambey: ['Bambey', 'Ngoye', 'Ndiob'],
  Diourbel: ['Diourbel', 'Ndindy', 'Touré Mbonde'],
  Mbacké: ['Mbacké', 'Touba', 'Dahra'],
  Fatick: ['Fatick', 'Niakhar', 'Diakhao'],
  Foundiougne: ['Foundiougne', 'Dionewar', 'Sokone'],
  Gossas: ['Gossas', 'Mbar', 'Colobane'],
  Birkelane: ['Birkelane', 'Keur Madiabel', 'Nguéniène'],
  Kaffrine: ['Kaffrine', 'Koungheul', 'Malem Hodar'],
  Guinguinéo: ['Guinguinéo', 'Ndiago', 'Loul Sessène'],
  Kédougou: ['Kédougou', 'Salemata', 'Saraya'],
  Kolda: ['Kolda', 'Médina Yoro Foulah', 'Vélingara'],
  Louga: ['Louga', 'Kébémer', 'Linguère'],
  Matam: ['Matam', 'Kanel', 'Ranérou'],
  'Saint-Louis': ['Saint-Louis', 'Dagana', 'Podor'],
  Ziguinchor: ['Ziguinchor', 'Bignona', 'Oussouye'],
};

export const mapDepartmentByRegion = ({ region }) => {
  if (!region || !senegalRegions[region]) {
    return Object.keys(communesByDepartment).map((dept) => ({
      name: dept,
      value: dept.replace(/\s+/g, '_'),
    }));
  }
  return senegalRegions[region].map((dept) => ({
    name: dept,
    value: dept.replace(/\s+/g, '_'),
  }));
};

export const mapCommuneByDepartment = ({ department }) => {
  if (!department || !communesByDepartment[department]) {
    return Object.keys(communesByDepartment).map((commune) => ({
      name: commune,
      value: commune.replace(/\s+/g, '_'),
    }));
  }
  return communesByDepartment[department].map((commune) => ({
    name: commune,
    value: commune.replace(/\s+/g, '_'),
  }));
};

export const mapSchoolsByRegion = ({ schools }) => {
  if (schools && Array.isArray(schools.data)) {
    return schools.data.map((school) => ({
      name: school.attributes.name,
      value: school.id,
    }));
  }
  return [];
};

// map schools by type
export const mapSchoolsByTypes = ({ schools, type }) => {
  if (schools && Array.isArray(schools.data)) {
    return schools.data.map((school) => {
      if (school.attributes.type === type) {
        return {
          name: school.attributes.name,
          value: school.id,
        };
      }
      return null;
    });
  }
  return [];
};
