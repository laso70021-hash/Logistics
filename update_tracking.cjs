const fs = require('fs');
let content = fs.readFileSync('src/pages/public/TrackingPage.tsx', 'utf8');

const target = `{event.note && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">{event.note}</p>
                          )}`;

const replacement = `{event.note && (
                            <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                              {event.note.startsWith('Exception:') ? (
                                <>
                                  <span className="font-bold">Exception:</span>{event.note.substring(10)}
                                </>
                              ) : (
                                event.note
                              )}
                            </p>
                          )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/public/TrackingPage.tsx', content);
