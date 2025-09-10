// Bulk import API functions for student data

// Download Excel template
export const downloadTemplate = async ({ token }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1338'}/api/students/bulk/template`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.error?.message || 'Erreur de téléchargement du modèle',
            data: errorData
        };
    }

    return await response.blob();
};

// Validate uploaded file data
export const validateBulkImport = async ({ file, token }) => {
    const formData = new FormData();
    formData.append('file', file);

    // Use direct fetch for file uploads to avoid content-type issues
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1338'}/api/students/bulk/validate`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type header - let browser set it automatically for FormData
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.error?.message || 'Erreur de validation',
            data: errorData
        };
    }

    return await response.json();
};

// Start bulk import process
export const startBulkImport = async ({ file, token, options = {} }) => {
    const formData = new FormData();
    formData.append('file', file);

    // Add import options based on backend guide
    formData.append('skipErrors', options.skipErrors || 'false');
    formData.append('generateIdentifiers', options.generateIdentifiers || 'true');

    // Use direct fetch for file uploads to avoid content-type issues
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1338'}/api/students/bulk/import`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type header - let browser set it automatically for FormData
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.error?.message || 'Erreur d\'importation',
            data: errorData
        };
    }

    return await response.json();
};

// Get import statistics
export const getImportStats = async ({ token }) => {
    return await fetcher({
        uri: routes.api_route.alazhar.get.bulkImport.stats || '/students/bulk/stats',
        options: {
            method: 'GET',
        },
        user_token: token,
    });
};
