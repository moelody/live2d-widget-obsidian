
onmessage = async evt =>
{
    console.log(evt.data);
    (postMessage as any)('Worker: Posting message back to main script');
};
