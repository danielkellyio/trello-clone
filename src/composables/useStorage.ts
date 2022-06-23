import { FILE_CREATE_MUTATION } from "@/graphql";
import { useMutation } from "@vue/apollo-composable";

const fileUploadInfo = {
  policy:
    "eyJjYWxsIjpbInJlYWQiLCJwaWNrIiwic3RvcmUiLCJjb252ZXJ0Il0sImV4cGlyeSI6MTY1NjEwMDIxNSwicGF0aCI6InByb2R1Y3Rpb24vY2wydXVzZjZ1MDBieDA5anFlMzR3OGp5Mi9jbDRyZnY5NGMwMDc4MGFtbmM4c2I5cTQ2LyJ9",
  signature: "42814d8105138a31aecf70cbcecfaa0fc090983a8f165f7968d9a2d709de7952",
  apiKey: "AAdy0pa0JQ9Wriwz3cDXrz",
  path: "production/cl2uusf6u00bx09jqe34w8jy2/cl4rfv94c00780amnc8sb9q46/",
};
export function useStorage() {
  async function uploadAsset(file: File) {
    file.type;
    const res = await fetch(
      `https://www.filestackapi.com/api/store/S3?key=${fileUploadInfo.apiKey}&policy=${fileUploadInfo.policy}&signature=${fileUploadInfo.signature}&path=${fileUploadInfo.path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      }
    );
    return await res.json();
  }
  return {
    uploadAsset,
  };
}
export default useStorage;
