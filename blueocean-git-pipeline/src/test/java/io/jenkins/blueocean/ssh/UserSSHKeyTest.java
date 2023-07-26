/*
 * The MIT License
 *
 * Copyright (c) 2017, CloudBees, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package io.jenkins.blueocean.ssh;

import com.mashape.unirest.http.exceptions.UnirestException;
import hudson.model.User;
import io.jenkins.blueocean.rest.impl.pipeline.PipelineBaseTest;
import org.junit.Assert;
import org.junit.Test;

import java.io.IOException;
import java.util.Map;

/**
 * Test for User's Jenkins-managed public/private key pair
 * @author kzantow
 */
public class UserSSHKeyTest extends PipelineBaseTest {
    @Test
    public void createPersonalSSHKey() throws IOException, UnirestException {
        User bob = login(); // bob

        Map resp = new RequestBuilder(baseUrl)
                .status(200)
                .jwtToken(getJwtToken(j.jenkins, bob.getId(), bob.getId()))
                .get("/organizations/jenkins/user/publickey/").build(Map.class);

        Object pubKey = resp.get("publickey");
        Assert.assertTrue(pubKey != null);

        // make sure the key remains the same
        resp = new RequestBuilder(baseUrl)
                .status(200)
                .jwtToken(getJwtToken(j.jenkins, bob.getId(), bob.getId()))
                .get("/organizations/jenkins/user/publickey/").build(Map.class);

        Object pubKey2 = resp.get("publickey");
        Assert.assertEquals(pubKey, pubKey2);

        // test deleting it gives a new key
        new RequestBuilder(baseUrl)
                .status(200)
                .jwtToken(getJwtToken(j.jenkins, bob.getId(), bob.getId()))
                .delete("/organizations/jenkins/user/publickey/").build(String.class);

        resp = new RequestBuilder(baseUrl)
                .status(200)
                .jwtToken(getJwtToken(j.jenkins, bob.getId(), bob.getId()))
                .get("/organizations/jenkins/user/publickey/").build(Map.class);

        Object pubKey3 = resp.get("publickey");
        Assert.assertNotEquals(pubKey2, pubKey3);

        // ensure login is required
        new RequestBuilder(baseUrl)
                .status(401)
                .get("/organizations/jenkins/users/bob/publickey/").build(Map.class);

        // make sure one user can't see another user's key
        new RequestBuilder(baseUrl)
                .status(403)
                .jwtToken(getJwtToken(j.jenkins, "alice", "alice"))
                .get("/organizations/jenkins/users/bob/publickey/").build(Map.class);
    }
}
