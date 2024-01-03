export enum StatusCode {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
}

interface BaseResponse {
    message: string;
    error?: string;
}

export interface SwapHistoryResponse extends BaseResponse {
    swaps: Swaps[];
}

export interface SwapCreateResponse extends BaseResponse {
    output: {
        code: StatusCode;
        image: string;
        msg: string;
        status: string;
    };
}

export type Swaps = {
    id: number;
    name: string | null;
    source_img: string;
    target_img: string;
    output_img_url: string;
    createdAt: string;
    updatedAt: string;
    cached_days: number;
    det_thresh: number;
    weight: number;
};

export type swapParams = {
    name: string;
    det_thresh: number;
    cache_days: number;
    weight: number;
};

export async function GetSwaps(): Promise<SwapHistoryResponse> {
    try {
        const request = await fetch(`${process.env.API_URL}/api/faceswap/swap`);
        if (!request.ok) {
            throw new Error("Network response was not ok");
        }
        return request.json();
    } catch (error) {
        console.error("Error fetching swaps:", error);
        throw new Error("Error fetching swaps");
    }
}

// const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       setIsUploading(true);
//       const formData = new FormData();
//       formData.append("src_image", src_image as Blob);
//       formData.append("cache_days", params.cache_days.toString());
//       formData.append("target_img", target_img as Blob);
//       formData.append("det_thresh", params.det_thresh.toString());
//       formData.append("weight", params.weight.toString());
//       formData.append("name", params.name);

//       const response = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
//         method: "POST",
//         body: formData,
//       });

//       console.log(response);
//       response.json().then((data) => {
//         setResultImg(data.output.image);
//       });

//       // Handle success or redirect as needed
//       console.log("Upload successful!");
//       setIsUploading(false);
//       onUploadSuccess();
//     } catch (error) {
//       setIsUploading(false);
//       console.error("Error uploading files:", error);
//     }
//   };

export interface SwapCreateFormData extends FormData {
    src_image: File;
    target_img: File;
    cache_days: number;
    det_thresh: number;
    weight: number;
    name: string;
}

export async function CreateSwap(formData: SwapCreateFormData): Promise<SwapCreateResponse> {
    try {
        // const data = new FormData();
        // data.append("src_image", src_image);
        // data.append("cache_days", params.cache_days.toString());
        // data.append("target_img", target_img);
        // data.append("det_thresh", params.det_thresh.toString());
        // data.append("weight", params.weight.toString());
        // data.append("name", params.name);
        const data = formData;
        const request = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
            method: "POST",
            body: data,
        });

        if (!request.ok) {
            throw new Error("Network response was not ok");
        }
        return await request.json() as unknown as Promise<SwapCreateResponse>;
    } catch (error) {
        console.error("Error creating swap:", error);
        throw new Error("Error creating swap");
    }
}

export async function DeleteSwap(id: number): Promise<BaseResponse> {
    try {
        if (!id) {
            throw new Error("Invalid ID provided, from client");
        }
        const data = new FormData();
        data.append("id", id.toString());
        const request = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
            method: "DELETE",
            body: data,
        });

        if (!request.ok) {
            throw new Error("Network response was not ok");
        }
        return await request.json() as unknown as Promise<BaseResponse>;
    } catch (error) {
        console.error("Error deleting swap:", error);
        throw new Error("Error deleting swap");
    }
}

export async function UpdateSwap(id: number, name: string): Promise<BaseResponse> {
    try {
        if (!id) {
            throw new Error("Invalid ID provided, from client");
        }
        const data = new FormData();
        data.append("id", id.toString());
        data.append("name", name);
        const request = await fetch(`${process.env.API_URL}/api/faceswap/swap`, {
            method: "PUT",
            body: data,
        });

        if (!request.ok) {
            throw new Error("Network response was not ok");
        }
        return await request.json() as unknown as Promise<BaseResponse>;
    } catch (error) {
        console.error("Error updating swap:", error);
        throw new Error("Error updating swap");
    }
}