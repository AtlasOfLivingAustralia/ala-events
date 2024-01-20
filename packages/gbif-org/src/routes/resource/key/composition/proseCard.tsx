import { AssetImage } from "@/gql/graphql";

export function ProseCard({
  title,
  excerpt,
  url,
  image,
}: {
  title: string;
  excerpt?: string;
  url: string;
  image?: AssetImage;
}) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {image && (
        <a href={url}>
          <img className="rounded-t-lg" src={image.file.mobile} alt="" />
        </a>
      )}
      <div className="p-5">
        <a href={url}>
          <h5
            className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: title }}
          ></h5>
        </a>
        {excerpt && (
          <p
            className="mb-3 font-normal text-gray-700 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          ></p>
        )}
      </div>
    </div>
  );
}