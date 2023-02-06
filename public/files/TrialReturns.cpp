#include<bits/stdc++.h>
#define ll long long 
#define pb push_back
#define eb emplace_back
using namespace std;
//////to check Prime number
bool isPrime(ll x)
{
  for(int i=2;i*i<=x;++i)
  {
    if(x%i==0)
    {
      return false;
    }
  }
  return true;
}
////// To implement Disjoint Set Union



  vector<int>parent;
  vector<int>ranker;
  void make_set(int v)
  {
    parent[v]=v;
    ranker[v]=0;
  }
  int find_set(int v)
  {
    if(v==parent[v])
    {
      return v;
    }
    return parent[v]=find_set(parent[v]);
  }
  void union_sets(int a,int b)
  {
    a=find_set(a);
    b=find_set(b);
    if(a!=b)
    {
      if(ranker[a]<ranker[b])
      {
        swap(a,b);
      }
      parent[b]=a;
      if(ranker[a]==ranker[b])
      {
        ranker[a]++;
      }
    }
  } 


/////Kruskal Algorithm
struct Edge
{

  int u,v,weight;
  bool operator<(Edge const& other)
  {
    return weight<other.weight;
  }
};


void Kruskal(int n_edge)
{
   //// n_edges denotes the number of edges denoting the number of edges

  parent.resize(n_edge);
  ranker.resize(n_edge);
  for(int i=0;i<n_edge;++i)
  {
    make_set(i);
  }
  vector<Edge>edges;
  vector<Edge>result;
  int cost=0;
  sort(edges.begin(),edges.end());
  for(Edge e:edges)
  {
    if(find_set(e.u)!=find_set(e.v))
    {
      cost+=e.weight;
      result.push_back(e);
      union_sets(e.u,e.v);
    }
  } 
}

////// Main function

int main()
{
  ios_base::sync_with_stdio(false);
  cin.tie(NULL);
  int t=1;
  cin>>t;
  while(t--)
  {
  	ll n;
  	cin>>n;
  	ll result=0;
  	vector<ll>v(n);
  	for(int i=0;i<n;++i)
  	{
  		cin>>v[i];
  		result+=v[i];
  	}
  	ll sum=0;
  	for(int i=0;i<n-1;++i)
  	{
  		ll x=-v[i];
  		ll y=-v[i+1];
  		cout<<"Value of x and y "<<x<<" "<<y<<"\n";
  		//result=max(result,result-v[i]-v[i+1]+x+y);
  		if((x+y)>(v[i]+v[i+1]))
  		{
  			sum+=x+y;
	  		v[i]=x;
	  		v[i+1]=y;
  		}
  		else
  		{
  			sum+=v[i]+v[i+1];
  		}
  	}
  	cout<<sum<<"\n";
  	//cout<<result<<"\n";
  }
  return 0;
}