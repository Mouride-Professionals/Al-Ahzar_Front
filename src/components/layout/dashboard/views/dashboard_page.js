import { Stack, Text, Wrap } from "@chakra-ui/react";
import { Statistics } from "@components/func/lists/Statistic";
import { DashboardLayout } from "@components/layout/dashboard";
import { Suspense } from "react";

export default function DashboardPage({
    title,
    currentPage,
    cardStats,
    datasetTitle,
    DataSetComponent,
    datasetProps,
}) {
    return (
        <DashboardLayout title={title} currentPage={currentPage}>
            <Wrap mt={10} spacing={20.01}>
                <Statistics cardStats={cardStats} />

                <Text color="gray.700" fontSize={20} fontWeight={"700"} pt={10}>
                    {datasetTitle}
                </Text>

                <Stack bgColor="white" w={"100%"}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DataSetComponent {...datasetProps} />
                    </Suspense>
                </Stack>
            </Wrap>
        </DashboardLayout>
    );
}
