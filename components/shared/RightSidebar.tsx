import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import UserCard from "@/components/cards/UserCard";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";
import SuggestedCommunityCard from "../cards/SuggestedCommunityCard";

const RightSidebar = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch Users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  // Fetch Community
  const result2 = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 3,
  });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Community
        </h3>

        <div className="mt-5 flex flex-col gap-9">
        {result2.communities.length === 0 ? (
          <p className="no-result">2No communities</p>
        ) : (
          <>
            {result2.communities.map((community) => (
              <SuggestedCommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

        <div className="mt-5 flex flex-col gap-9">
          {result.users.length === 0 ? (
            <p className="no-result">No users</p>
          ) : (
            <>
              {result.users.map((person) => (
                <UserCard
                  key={person.id}
                  id={person.id}
                  name={person.name}
                  username={person.username}
                  imgUrl={person.image}
                  personType="User"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
