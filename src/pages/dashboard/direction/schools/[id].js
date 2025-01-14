import { serverFetch } from 'src/lib/api';
import { DashboardLayout } from '@components/layout/dashboard';
import { VStack, Box, Text, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function ClassList({ schoolId, initialClasses }) {
  const [classes, setClasses] = useState(initialClasses || []);
  const [loading, setLoading] = useState(!initialClasses);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data } = await serverFetch({
        uri: `/schools/${schoolId}?populate=classes`,
      });
      setClasses(data.attributes.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialClasses) {
      fetchClasses();
    }
  }, [schoolId]);

  return (
    <DashboardLayout title="Classes">
      <VStack spacing={6} align="stretch">
        {loading ? (
          <Spinner size="lg" />
        ) : classes.length > 0 ? (
          classes.map((cls) => (
            <Box key={cls.id} borderWidth="1px" borderRadius="lg" p={4}>
              <Text fontSize="lg">
                {cls.level} - {cls.letter}
              </Text>
            </Box>
          ))
        ) : (
          <Text>No classes available.</Text>
        )}
      </VStack>
    </DashboardLayout>
  );
}

export const getServerSideProps = async ({ params }) => {
  const { schoolId } = params;
  const { data } = await serverFetch({
    uri: `/schools/${schoolId}?populate=classes`,
  });

  return {
    props: {
      schoolId,
      initialClasses: data.attributes.classes || [],
    },
  };
};
