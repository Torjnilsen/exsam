import React from "react";

interface AuctionListingProps {
    id: string;
    title: string;
    description: string;
    endsAt: string;
    created: string;
    updated: string;
    media: string[];
    tags: string[];
    _count: {
      bids: number;
    };
}

const AuctionListing: React.FC<AuctionListingProps> = ({
    id,
    title,
    description,
    endsAt,
    created,
    updated,
    media,
    tags,
    _count,
}) => {
    return(
        <div id={id} className="border p-4">
          <h3>{title}</h3>
          <p>{description}</p>
          <p>{endsAt}</p>  
          <p>{created}</p> 
          <p>{updated}</p>  
          <p>{media}</p>  
          <p>{tags}</p>  
          <p>Bids Count{ _count.bids}</p>  
        </div>
    )
}

export default AuctionListing;