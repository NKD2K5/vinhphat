/**
 * Helper function to save About section data to Payload CMS
 * Creates a new document or updates existing one
 */

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001';

interface AboutData {
  title: string;
  description: any[];
  image?: string | any;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
}

export async function saveAboutToCMS(data: AboutData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Step 1: Check if an About document already exists
    const checkResponse = await fetch(`${PAYLOAD_API_URL}/api/about-page?limit=1`);
    
    if (!checkResponse.ok) {
      throw new Error('Failed to check existing About documents');
    }

    const checkData = await checkResponse.json();
    const existingDoc = checkData.docs?.[0];

    // Step 2: Prepare the payload
    const payload = {
      title: data.title,
      description: data.description,
      image: typeof data.image === 'object' && data.image?.id ? data.image.id : data.image,
      primaryButton: data.primaryButton,
      secondaryButton: data.secondaryButton,
    };

    let response;
    let method: string;
    let url: string;

    if (existingDoc) {
      // Update existing document
      method = 'PATCH';
      url = `${PAYLOAD_API_URL}/api/about-page/${existingDoc.id}`;
    } else {
      // Create new document
      method = 'POST';
      url = `${PAYLOAD_API_URL}/api/about-page`;
    }

    // Step 3: Make the API request
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save About data');
    }

    const result = await response.json();

    return {
      success: true,
      id: result.doc?.id || result.id,
    };
  } catch (error) {
    console.error('Error saving About to CMS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
